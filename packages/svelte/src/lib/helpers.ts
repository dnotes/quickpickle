import { CucumberExpression, RegularExpression, ParameterTypeRegistry } from "@cucumber/cucumber-expressions";
import { pick } from "lodash-es";
import pkg from 'regexp-tree'
const { parse, generate } = pkg;
import type {
  AstNode,
  Alternative,
  Disjunction,
  Group,
  Repetition,
  Quantifier,
} from 'regexp-tree/ast'

type GroupBuilder<T> = {
  capturing:boolean
  source:T
  groupBuilders:GroupBuilder<string>[]
}

export type StepParameter = {
  idx:number,
  name:string,
  type:'string'|'int'|'float'|'word'|'anonymous'|'bigstring'|'datatable'|'options',
  source:string
  required:boolean
  group:number|null
  value:string
}
export type StepMatcher = {
  text:string,
  param: RegExp
}
export type StepPart = {
  idx:'text'|number
  type:string
  matcher:RegExp
  options?:string[]
}
export type StepDefinition = {
  keyword:string
  label:string
  matcher:RegExp
  parts:StepPart[]
  params:StepParameter[]
}
type ExtraStuff = {
  treeRegexp: {
    regexp:RegExp,
    groupBuilder:GroupBuilder<undefined>
  }
  [key:string]:any
}
export function getSteps(rawCode:string, ptr:ParameterTypeRegistry = new ParameterTypeRegistry):StepDefinition[] {

  const rx = /^\s*(Given|When|Then)\((\/[^\/]+\/|"[^"]+"|'[^']+'|`[^`]+`).*?\((.*?)\)[\s\n]*\{/gm

  let stepList = rawCode.matchAll(rx)
  let steps:StepDefinition[] = []

  for (let [,keyword,patternStr,paramsStr] of stepList) {

    let isRegex = patternStr.match(/^\/.+\/$|['"]\/.+\/['"]/) ? true : false
    patternStr = patternStr
      .replace(/^(?:['"]?\/\^?|"|'|`)/, '')
      .replace(/(?:\$?\/['"]?|"|'|`)$/, '')

    let paramsList = paramsStr.split(',')
      .map(p => p.trim())
      .filter(p => !p.startsWith('this'))
      .map((p,idx) => {
        let [,name,type,optional] = p.match(/^(\w+)(?:\s*:\s*(\w+))?(\s*=.+)?$/) || []
        return {
          idx:idx,
          name:name,
          type:type || '',
        }
      })

    // @ts-ignore No matcher yet, and it's not getting the proper type definitions for RegularExpression and CucumberExpression
    let step:StepDefinition & ExtraStuff = {
      keyword,
      label: patternStr,
      params: [],
      ...(isRegex ? new RegularExpression(new RegExp(patternStr), ptr) : new CucumberExpression(patternStr, ptr))
    }
    step.matcher = transformRegExpToPartial(step.treeRegexp.regexp)
    step.parts = []

    let group:number = 1
    for (let i=0; i<step.treeRegexp.groupBuilder.groupBuilders.length; i++) {
      let builder = step.treeRegexp.groupBuilder.groupBuilders[i]
      let param:StepParameter = {
        idx:i,
        name:paramsList[i]?.name ?? `param ${i}`,
        type:'string',
        source:builder.source,
        required: true,
        group,
        value:'',
      }
      group += countCapturingGroups(builder)
      if (builder.source.match(/^[-\(\?:\[\{\d\\d\+\*\|\s\}\)\]]+d[\{\d\+\*\s\}\)\]]*$/)) param.type = 'int'
      else if (builder.source.match(/^[-\(\?:\[\{\d\\dE=\.\+\*\|\s\}\)\]]+d[\{\d\+\*E\?\s\}\)\]]*$/)) param.type = 'float'
      else if (builder.source.match(/(?:[\w\d\s]+)(?:\|[\w\d\s]+)+/)) param.type = 'options'
      else if (builder.source.match(/^(?:\[^\\s\]|\\S|\\w|\[[-\w]\])[\+\*]$/)) {
        param.type = 'word'
        param.required = builder.source.includes('+')
      }
      else if (builder.source.match(/^\.[\*\+]$/)) {
        param.type = 'anonymous'
        param.required = builder.source.includes('+')
      }
      step.params.push(param)
    }

    // Create the parts
    let remaining:string = step.treeRegexp.regexp.source.replace(/^\^/,'').replace(/\$$/,'')
    for (let i=0; i<step.params.length; i++) {
      let param = step.params[i]
      let [text,next] = remaining.split(`(${param.source})`,2)
      step.parts.push({
        idx:'text',
        type:regexToText(text),
        matcher:new RegExp(regexToText(text),'g'),
      })
      step.parts.push({
        idx:param.idx,
        type:param.type,
        matcher:new RegExp(param.source),
        options:param.type === 'options' ? param.source.split('|') : undefined,
      })
      remaining = next
    }
    if (remaining?.length) {
      step.parts.push({
        idx:'text',
        type:regexToText(remaining),
        matcher:new RegExp(remaining),
      })
    }


    if (paramsList.length > step.params.length) {
      let param = paramsList[step.params.length]
      step.params.push({
        idx: step.params.length,
        name: param.name,
        type: (param.type === 'DataTable' || param.name.match(/(?:data|table)/i)) ? 'datatable' : 'bigstring',
        source:'',
        required: true,
        group:null,
        value:'',
      })
    }

    if (isRegex) {

      normalizeRegexLabel(step)

    }

    steps.push(pick(step, ['keyword', 'label', 'matcher', 'params', 'parts']))

  }

  return steps

}

export function normalizeRegexLabel(step:StepDefinition & ExtraStuff) {

  for (let i=0; i< step.treeRegexp.groupBuilder.groupBuilders.length; i++) {
    let builder = step.treeRegexp.groupBuilder.groupBuilders[i]
    let type = step.params[i].type
    if (step.params[i].type !== 'options') step.label = step.label.replace('(' + builder.source + ')', `{${type}}`)
    else step.label = step.label.replace('(' + builder.source + ')', `${builder.source.replace(/\|/g, '/')}`)
  }
  step.label = step.label.replace(/\(\?\:([^\)\|]+)(?:\|[^\)]+)?\)\?/g, '($1)') // Replace non-capturing optional groups with just the first option
  step.label = step.label.replace(/\(\?\:([^\)]+?)(?:\|[^\)]+)?\)/g, '$1') // Replace non-capturing groups with just the first option
  step.label = step.label.replace(/([^\\])\?/g, '($1)') // Replace optional characters with parentheticals
  step.label = step.label.replace(/["']?\{string\}["']?/g, '{string}') // Replace quoted string parameters with just the parameter, to match Cucumber Expressions
  step.label = step.label.replace(/\{anonymous\}/g, '{}') // Replace anonymous parameters with just the parameter, to match Cucumber Expressions

}

function regexToText(exp:string) {
  return exp
    .replace(/\(\?\:([^\)\|]+)(?:\|[^\)]+)?\)\?/g, '') // Remove optional groups
    .replace(/\(\?\:([^\)]+?)(?:\|[^\)]+)?\)/g, '$1') // Replace non-capturing groups with just the first option
    .replace(/([^\\])\?/g, '') // Remove optional characters
}


export function transformRegExpToPartial(exp: RegExp | string): RegExp {

  let source = exp.toString().replace(/^\/?\^*/,'').replace(/\$*\/?$/,'')
  const ast = parse('/' + source + '/');

  // Function to recursively transform the AST
  function transform(node: AstNode): void {
    switch (node.type) {
      case 'Alternative': {
        const expressions = node.expressions!;
        // Process expressions from left to right
        for (let i = 0; i < expressions.length; i++) {
          const subExpressions = expressions.slice(i + 1);

          if (subExpressions.length > 0) {
            // Wrap the remaining expressions in an optional non-capturing group
            const groupNode: Group = {
              type: 'Group',
              capturing: false,
              expression: {
                type: 'Alternative',
                expressions: subExpressions,
              },
            };

            // Make the group optional
            const repetitionNode: Repetition = {
              type: 'Repetition',
              expression: groupNode,
              quantifier: {
                type: 'Quantifier',
                kind: '?',
                greedy: true,
              } as Quantifier,
            };

            // Replace expressions[i + 1] with the new repetition node
            expressions[i + 1] = repetitionNode;

            // Remove the rest of the expressions, since they are now in the group
            expressions.length = i + 2;
          }

          // Recursively transform the current expression
          transform(expressions[i]);
        }
        break;
      }

      case 'Group': {
        transform(node.expression!);
        break;
      }

      case 'Disjunction': {
        transform(node.left!);
        transform(node.right!);
        break;
      }

      case 'Repetition': {
        transform(node.expression!);
        break;
      }

      // For other node types (Char, CharacterClass, etc.), no action is needed
      default:
        break;
    }
  }

  // Start transforming from the root of the AST
  transform(ast.body!);

  // Generate the new regular expression pattern from the transformed AST
  const newPattern = generate(ast).replace(/^\//, '^(?:').replace(/\/$/, ')?$');

  // Return a new RegExp object with the original flags
  return new RegExp(newPattern, 'i');
}

function countCapturingGroups(groupBuilder: GroupBuilder<undefined|string>): number {
  // Start with 1 if the current group is capturing, else 0
  let count = groupBuilder.capturing ? 1 : 0;

  // Recursively count capturing groups in child groupBuilders
  for (const child of groupBuilder.groupBuilders) {
    count += countCapturingGroups(child);
  }

  return count;
}