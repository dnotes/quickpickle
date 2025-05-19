import { intersection } from 'lodash-es'
import parse from '@cucumber/tag-expressions';

export function normalizeTags(tags?:string|string[]|undefined):string[] {
  if (!tags) return []
  tags = Array.isArray(tags) ? tags : tags.split(/\s*,\s*/g)
  return tags.filter(Boolean).map(tag => tag.startsWith('@') ? tag : `@${tag}`)
}

/**
 * Compares two lists of tags and returns the ones that are shared by both,
 * or null if there are no shared tags.
 *
 * @param confTags string[]
 * @param testTags string[]
 * @returns string[]|null
 */
export function tagsMatch(confTags:string[], testTags:string[]) {
  let tags = intersection(confTags.map(t => t.toLowerCase()), testTags.map(t => t.toLowerCase()))
  return tags?.length ? tags : null
}

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

export function tagsFunction(tagsExpression?:string):(tags: string[])=>boolean {
  if (!tagsExpression) {
    return () => true;
  }

  const parsedTagsExpression = parseTagsExpression(tagsExpression);

  return (tags: string[]) => {
    const result = parsedTagsExpression.evaluate(tags);
    return result;
  };
}