export function normalizeTags(tags?:string|string[]|undefined):string[] {
  if (!tags) return []
  tags = Array.isArray(tags) ? tags : tags.split(/\s*,\s*/g)
  return tags.filter(Boolean).map(tag => tag.startsWith('@') ? tag : `@${tag}`)
}
