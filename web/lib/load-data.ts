
export type Event = {
    Id: number;
    Name: string;
    Path: string;
    Body: string;
}

type LanguagesMap<T extends string> = {
    [language in T]: number
} 

export type Language = {
    Id: number;
    Languages: LanguagesMap<string>[]
}

type Magic = {
    "grade-01-result": number
}

export type Game = {
    Id: number;
    Name: string;
    Path: string;
    Body: string;
    parent: number;
    Meta: Record<string, string>;
    Magic: Magic
}

export async function loadGames(): Promise<Game[]> {
    const res = await fetch('https://raw.githubusercontent.com/schweller/panacea/main/web/public/games.json')
    const data = await res.json()

    return data as Game[]
}

export async function loadEvents() {
    const res = await fetch('https://raw.githubusercontent.com/schweller/panacea/main/web/public/events.json')
    const data = await res.json()

    return data as Event[]
}

export async function loadLanguages() {
    const res = await fetch('https://raw.githubusercontent.com/schweller/panacea/main/web/public/languages.json')
    const data = await res.json()

    return data as Language[]
}
