export const CIRCUITS = {
  atp: 'ATP',
  wta: 'WTA',
  'grand-chelem': 'Grand Chelem',
}

export const SURFACES = {
  dur: 'Dur',
  'terre-battue': 'Terre battue',
  gazon: 'Gazon',
  indoor: 'Indoor (salle)',
}

export const CATEGORIES = {
  1000: 'Masters 1000',
  500: '500',
  250: '250',
}

const nomsDePays = new Intl.DisplayNames(['fr'], { type: 'region' })

export const PAYS = new Proxy(
  {},
  {
    get: (_, code) => (typeof code === 'string' ? nomsDePays.of(code) : undefined),
  },
)

export const MAINS = {
  droite: 'Droite',
  gauche: 'Gauche',
}