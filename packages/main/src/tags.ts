import parse from '@cucumber/tag-expressions';

interface TagExpression {
  evaluate: (tags: string[]) => boolean;
}

const parseTagsExpression = (tagsExpression: string): TagExpression => {
  try {
    const parsedExpression = parse(tagsExpression);
    return parsedExpression;
  } catch (error) {
    throw new Error(`Failed to parse tag expression: ${(error as Error).message}`);
  }
}

export const tagsFunction = (tagsExpression?: string): (tags: string[]) => boolean => {
  if (!tagsExpression) {
    return (tags: string[]) => true;
  }

  const parsedTagsExpression = parseTagsExpression(tagsExpression);

  return (tags: string[]) => {
    const result = parsedTagsExpression.evaluate(tags);
    return result;
  };
}
