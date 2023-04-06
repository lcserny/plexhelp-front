import { MediaFileType, RenamedMediaOptions } from "./generated"

export type ExtendedRenamedMediaOptions = {
    renameOptions: RenamedMediaOptions,
    type?: MediaFileType,
}