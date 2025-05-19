/**
 * Type definition from @cucumber/cucumber/lib/support_code_library_builder/types
 */
export interface IParameterTypeDefinition<T> {
    name: string;
    regexp: readonly RegExp[] | readonly string[] | RegExp | string;
    transformer?: (...match: string[]) => T;
    useForSnippets?: boolean;
    preferForRegexpMatch?: boolean;
}

