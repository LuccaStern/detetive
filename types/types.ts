export type CardType = {
    name: string;
    type: string;
    place: string;
}

export type CrimeType = {
    local: CardType;
    arma: CardType;
    pessoa: CardType;
}