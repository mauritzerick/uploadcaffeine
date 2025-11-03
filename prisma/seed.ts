import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const developerQuotes = [
  "Sleep? In this economy?",
  "404: Motivation not found",
  "Deploy coffee → deploy creativity",
  "Caffeine-driven development in progress...",
  "Bug? Feature? Let's call it art.",
  "Compiling hopes and dreams...",
  "Code is poetry. Coffee is fuel.",
  "While(coffee){code()}",
  "System.out.println('Need coffee');",
  "/* TODO: Add more caffeine */",
  "Turning coffee into code since forever",
  "Error 418: I'm a teapot (need coffee)",
  "const success = coffee + code;",
  "Debugging reality, one cup at a time",
  "In code we trust, in coffee we thrive",
  "Console.log('☕ = 💪');",
  "Ship fast, break things, drink coffee",
  "The only constant is coffee",
  "printf('coffee overflow');",
  "if (tired) { drink(coffee); }",
  "Dreams don't compile without coffee",
  "git commit -m 'caffeinated brilliance'",
  "Stack overflow? More like stack of cups",
  "Async/await for that next coffee break",
  "Recursion: see coffee, drink coffee, repeat",
  "NullPointerException: Coffee not found",
  "404 sleep not found. Coffee detected.",
  "Code is temporary. Coffee is eternal.",
  "I don't always test my code, but when I do, I do it in production",
  "There are 10 types of people: those who understand binary and those who don't",
  "Programming is 10% writing code and 90% figuring out why it doesn't work",
  "Copy-paste from Stack Overflow: 90% of programming",
]

async function main() {
  console.log('🌱 Seeding database with dev quotes...')

  // Clear existing quotes
  await prisma.devQuote.deleteMany()
  console.log('   Cleared existing quotes')

  // Add all quotes
  for (const quote of developerQuotes) {
    await prisma.devQuote.create({
      data: {
        quote,
        isActive: true,
      },
    })
  }

  console.log(`✅ Added ${developerQuotes.length} dev quotes to database`)
  
  // Show a random quote as example
  const randomQuote = await prisma.devQuote.findFirst({
    skip: Math.floor(Math.random() * developerQuotes.length),
  })
  
  if (randomQuote) {
    console.log(`📝 Example quote: "${randomQuote.quote}"`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


