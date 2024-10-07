import { ExpressionFactory, ParameterTypeRegistry, Expression } from '@cucumber/cucumber-expressions';

interface StepDefinition {
  expression: string;
  f: (state: any, ...args: any[]) => any;
  cucumberExpression: Expression;
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

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

export const addStepDefinition = (expression: string, f: (state: any, ...args: any[]) => any): void => {
  const cucumberExpression = expressionFactory.createExpression(expression);
  steps.push({ expression, f, cucumberExpression });
};

const findStepDefinitionMatches = (step:string): StepDefinitionMatch[] => {
  return steps.reduce((accumulator: StepDefinitionMatch[], stepDefinition: StepDefinition) => {
    const matches = stepDefinition.cucumberExpression.match(step);
    if (matches) {
      return [...accumulator, {
        stepDefinition,
        parameters: matches.map((match: any) => match.getValue())
      }];
    } else {
      return accumulator;
    }
  }, []);
};

export const findStepDefinitionMatch = (step:string): StepDefinitionMatch => {
  const stepDefinitionMatches = findStepDefinitionMatches(step);

  if (!stepDefinitionMatches || stepDefinitionMatches.length === 0) {
    throw new Error(`Undefined. Implement with the following snippet:

  Given('${step}', (world, ...params) => {
    // Write code here that turns the phrase above into concrete actions
    throw new Error('Not yet implemented!');
    return state;
  });
`);
  }

  if (stepDefinitionMatches.length > 1) {
    throw new Error(`More than one step which matches: '${step}'`);
  }

  return stepDefinitionMatches[0];
};
