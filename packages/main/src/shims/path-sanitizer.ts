import { normalize, join } from "./path"

export interface SanitizeOptions {
    decode?: ({
        regex: RegExp
        replacement: string
    })[]
    /**
     * RegEx that filters out stuff like \..\ or /../
     */
    parentDirectoryRegEx?: RegExp
    /**
     * Characters to be removed from paths because the file system doesn't support these.
     */
    notAllowedRegEx?: RegExp
}

interface SanitizeOptionsComplete {
    decode: ({
        regex: RegExp
        replacement: string
    })[]
    /**
     * RegEx that filters out stuff like \..\ or /../
     */
    parentDirectoryRegEx: RegExp
    /**
     * Characters to be removed from paths because the file system doesn't support these.
     */
    notAllowedRegEx: RegExp
}

export const DEFAULT_OPTIONS: SanitizeOptionsComplete = {
    decode: [
        {
            regex: /%2e/g,
            replacement: '.'
        },
        {
            regex: /%2f/g,
            replacement: '/'
        },
        {
            regex: /%5c/g,
            replacement: '\\'
        }
    ],
    parentDirectoryRegEx: /[\/\\]\.\.[\/\\]/g,
    notAllowedRegEx: /:|\$|!|'|"|@|\+|`|\||=/g
}

/**
 * Sanitizes a portion of a path to avoid Path Traversal
 */
export default function sanitize(pathstr: string, options: SanitizeOptions = DEFAULT_OPTIONS): string {
    if (!options)
        options = DEFAULT_OPTIONS
    if (typeof options !== 'object')
        throw new Error('options must be an object')
    if (!Array.isArray(options.decode))
        options.decode = DEFAULT_OPTIONS.decode
    if (!options.parentDirectoryRegEx)
        options.parentDirectoryRegEx = DEFAULT_OPTIONS.parentDirectoryRegEx
    if (!options.notAllowedRegEx)
        options.notAllowedRegEx = DEFAULT_OPTIONS.notAllowedRegEx
    if (typeof pathstr !== 'string') {
        // Stringify the path
        pathstr = `${pathstr}`
    }
    let sanitizedPath = pathstr
    // ################################################################################################################
    // Decode
    options.decode.forEach(decode => {
        sanitizedPath = sanitizedPath.replace(decode.regex, decode.replacement)
    })
    // Remove not allowed characters
    sanitizedPath = sanitizedPath.replace(options.notAllowedRegEx, '')
    // Replace backslashes with normal slashes
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/')
    // Replace /../ with /
    sanitizedPath = sanitizedPath.replace(options.parentDirectoryRegEx, '/')
    // Remove ../ at pos 0 and /.. at end
    sanitizedPath = sanitizedPath.replace(/^\.\.[\/\\]/g, '/')
    sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.$/g, '/')
    // Replace double (back)slashes with a single slash
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/')
    // Normalize path
    sanitizedPath = normalize(sanitizedPath)
    // Remove / or \ in the end
    while (sanitizedPath.endsWith('/') || sanitizedPath.endsWith('\\')) {
        sanitizedPath = sanitizedPath.slice(0, -1)
    }
    // Remove / or \ in the beginning
    while (sanitizedPath.startsWith('/') || sanitizedPath.startsWith('\\')) {
        sanitizedPath = sanitizedPath.slice(1)
    }
    // Validate path
    sanitizedPath = join('', sanitizedPath)
    // Remove not allowed characters
    sanitizedPath = sanitizedPath.replace(options.notAllowedRegEx, '')
    // Again change all \ to /
    sanitizedPath = sanitizedPath.replace(/[\\]/g, '/')
    // Replace double (back)slashes with a single slash
    sanitizedPath = sanitizedPath.replace(/[\/\\]+/g, '/')

    // Replace /../ with /
    sanitizedPath = sanitizedPath.replace(options.parentDirectoryRegEx, '/')

    // Remove ./ or / at start
    while (sanitizedPath.startsWith('/') || sanitizedPath.startsWith('./') || sanitizedPath.endsWith('/..') || sanitizedPath.endsWith('/../') || sanitizedPath.startsWith('../') || sanitizedPath.startsWith('/../')) {
        sanitizedPath = sanitizedPath.replace(/^\.\//g, '') // ^./
        sanitizedPath = sanitizedPath.replace(/^\//g, '') // ^/
        // Remove ../ | /../ at pos 0 and /.. | /../ at end
        sanitizedPath = sanitizedPath.replace(/^[\/\\]\.\.[\/\\]/g, '/')
        sanitizedPath = sanitizedPath.replace(/^\.\.[\/\\]/g, '/')
        sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.$/g, '/')
        sanitizedPath = sanitizedPath.replace(/[\/\\]\.\.\/$/g, '/')
    }

    // Make sure out is not "."
    sanitizedPath = sanitizedPath.trim() === '.' ? '' : sanitizedPath

    return sanitizedPath.trim()
}