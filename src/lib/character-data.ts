export interface Character {
  id: "dude" | "dudette"
  name: string
  sprite: string
  description: string
  catchphrase: string
  personality: string[]
  reactions: {
    questComplete: string[]
    areaTransition: string[]
    timeWarning: string[]
    victory: string[]
    failure: string[]
  }
}

export const CHARACTERS: Record<string, Character> = {
  dude: {
    id: "dude",
    name: "JAKE 'SANDSTORM' RODRIGUEZ",
    sprite: "/image/rider-dude.png",
    description: "Radical dude from Dubai who lives for the thrill of the dunes!",
    catchphrase: "Let's shred this desert, bro!",
    personality: [
      "Totally radical attitude",
      "Says 'dude' and 'bro' a lot",
      "Loves extreme sports",
      "Never backs down from a challenge",
    ],
    reactions: {
      questComplete: [
        "Dude, that was SICK! 🤘",
        "Bro, we're totally crushing this mission!",
        "RADICAL! One step closer to saving the party!",
        "That's how we roll in the desert, baby!",
      ],
      areaTransition: [
        "Time to hit the road, bro!",
        "Let's see what this place has to offer!",
        "Desert vibes are calling, dude!",
        "Adventure awaits! Let's GOOO!",
      ],
      timeWarning: [
        "Whoa dude, time's running out!",
        "Gotta pick up the pace, bro!",
        "The clock's ticking - let's move!",
        "No time to chill, we got a party to save!",
      ],
      victory: [
        "YESSS! We totally nailed it, bro!",
        "That's what I'm talking about, dude!",
        "Desert legend status: ACHIEVED!",
        "We just saved the most radical party ever!",
      ],
      failure: [
        "Aw man, we totally wiped out...",
        "Bummer dude, the party's toast...",
        "That's a major wipeout, bro...",
        "The desert claimed another victim...",
      ],
    },
  },
  dudette: {
    id: "dudette",
    name: "ZARA 'LIGHTNING' AL-RASHID",
    sprite: "/image/rider-dudette.png",
    description: "Fierce desert queen who rules the dunes with style and speed!",
    catchphrase: "Time to show these dunes who's boss!",
    personality: [
      "Confident and fearless",
      "Quick-witted and determined",
      "Desert racing champion",
      "Never gives up, ever",
    ],
    reactions: {
      questComplete: [
        "YES! That's how it's done! 💪",
        "Another victory for the desert queen!",
        "Flawless execution, as always!",
        "They don't call me Lightning for nothing!",
      ],
      areaTransition: [
        "Let's see what challenges await!",
        "Time to conquer new territory!",
        "The desert calls, and I answer!",
        "Ready to dominate this next area!",
      ],
      timeWarning: [
        "Time to kick it into high gear!",
        "The clock won't wait - neither will I!",
        "Pressure makes diamonds, baby!",
        "This is where legends are made!",
      ],
      victory: [
        "BOOM! Desert queen saves the day!",
        "That's how you handle business!",
        "Victory tastes as sweet as matcha!",
        "Another impossible mission: COMPLETED!",
      ],
      failure: [
        "No... this can't be happening...",
        "The desert has claimed its prize...",
        "Even lightning can't outrun time...",
        "The party... I failed them all...",
      ],
    },
  },
}
