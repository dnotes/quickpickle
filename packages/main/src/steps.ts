import { ExpressionFactory, ParameterTypeRegistry, Expression, ParameterType, CucumberExpressionGenerator, GeneratedExpression } from '@cucumber/cucumber-expressions';
import { type IParameterTypeDefinition } from './shims/cucumber';

interface StepDefinition {
  expression: string|RegExp;
  f: (state: any, ...args: any[]) => any;
  cucumberExpression: Expression;
  priority: number;
}

interface Step {
  text: string;
  type: {
    type: 'given' | 'when' | 'then';
    name: string;
  };
}

interface StepDefinitionMatch {
  stepDefinition: StepDefinition;
  parameters: any[];
}

const steps: StepDefinition[] = [];

const typeName: Record<string, string> = {
  given: 'Given',
  then: 'Then',
  when: 'When',
};

const parameterTypeRegistry = new ParameterTypeRegistry();
const expressionFactory = new ExpressionFactory(parameterTypeRegistry);

const cucumberExpressionGenerator = new CucumberExpressionGenerator(() => parameterTypeRegistry.parameterTypes)

const buildParameterType = (type:IParameterTypeDefinition<any>): ParameterType<unknown> => {
  return new ParameterType(
    type.name,
    type.regexp,
    null,
    type.transformer,
    type.useForSnippets ?? true,
    type.preferForRegexpMatch ?? false,
  )
}

export const defineParameterType = (parameterType: IParameterTypeDefinition<any>): void => {
  parameterTypeRegistry.defineParameterType(buildParameterType(parameterType));
};

export const addStepDefinition = (expression: string|RegExp, f: (state: any, ...args: any[]) => any, priority: number = 0): void => {
  const cucumberExpression = expressionFactory.createExpression(expression);
  steps.push({ expression, f, cucumberExpression, priority });
};

const findStepDefinitionMatches = (step:string): StepDefinitionMatch[] => {
  return steps.reduce((accumulator: StepDefinitionMatch[], stepDefinition: StepDefinition) => {
    // Get the highest priority from the accumulator
    const priority = accumulator?.[0]?.stepDefinition.priority ?? -9999;
    // If the StepDefinition has a lower priority, don't even check it
    if (stepDefinition.priority < priority) return accumulator;
    // Check the StepDefinition for matches
    const matches = stepDefinition.cucumberExpression.match(step);
    // If there are no matches, skip it
    if (!matches) return accumulator;
    // If the StepDefinition matches the step, create a StepDefinitionMatch
    const stepDefinitionMatch: StepDefinitionMatch = {
      stepDefinition,
      parameters: matches.map((match: any) => match.getValue())
    }
    // Add to or replace the accumulator, depending on the priority
    return stepDefinition.priority === priority
      ? [...accumulator, stepDefinitionMatch]
      : [stepDefinitionMatch];
  }, []);
};

type SnippetData = {
  stepType:'Context'|'Action'|'Outcome'
  dataType:string
}
export const findStepDefinitionMatch = (step:string, snippetData:SnippetData): StepDefinitionMatch => {
  const stepDefinitionMatches = findStepDefinitionMatches(step);

  // If it's not found
  if (!stepDefinitionMatches || stepDefinitionMatches.length === 0) {
    let snippet = getSnippet(step, snippetData);
    throw new Error(`Undefined. Implement with the following snippet:
${snippet}
`);
  }

  if (stepDefinitionMatches.length > 1) {
    const priority = stepDefinitionMatches[0].stepDefinition?.priority ?? 0;
    const patterns = stepDefinitionMatches.map(m => m.stepDefinition.expression).join('\n - ');
    throw new Error(
      `Ambiguous step: '${step}'\n` +
      `Multiple patterns match with equal priority (${priority}):\n - ${patterns}\n\n` +
      `Resolve by adding a higher priority to one of them:\n` +
      `  Given('${step}', yourFunction, ${priority + 1});`
    );
  }

  return stepDefinitionMatches[0];
};

function getSnippet(step:string, { stepType, dataType }:SnippetData):string {

  const generatedExpressions = cucumberExpressionGenerator.generateExpressions(step);
  const stepParameterNames = dataType ? [dataType] : []

  let functionName:string = 'Given'
  if (stepType === 'Action') functionName = 'When'
  if (stepType === 'Outcome') functionName = 'Then'

  let implementation = "throw new Error('Not yet implemented')"

  const definitionChoices = generatedExpressions.map(
    (generatedExpression, index) => {
      const prefix = index === 0 ? '' : '// '
      const allParameterNames = ['world'].concat(
        generatedExpression.parameterNames,
        stepParameterNames
      )
      return `${prefix + functionName}('${escapeSpecialCharacters(
        generatedExpression
      )}', async function (${allParameterNames.join(', ')}) {\n`
    }
  )

  return (
    `${definitionChoices.join('')}  // Write code here that turns the phrase above into concrete actions\n` +
    `  ${implementation}\n` +
    '});'
  )

}

function escapeSpecialCharacters(generatedExpression: GeneratedExpression) {
  let source = generatedExpression.source
  // double up any backslashes because we're in a javascript string
  source = source.replace(/\\/g, '\\\\')
  // escape any single quotes because that's our quote delimiter
  source = source.replace(/'/g, "\\'")
  return source
}