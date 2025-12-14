import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const contentDir = path.join(process.cwd(), 'content')
const outputFile = path.join(process.cwd(), 'src', 'cafes.json')

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'))

const cafes = files.map(file => {
  const filePath = path.join(contentDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  const { data, content: body } = matter(content)
  const slug = file.replace('.mdx', '')
  const html = marked.parse(body.trim())
  
  return {
    slug,
    name: data.name,
    location: data.location,
    rating: data.rating,
    date: data.date,
    content: html
  }
})

fs.writeFileSync(outputFile, JSON.stringify(cafes, null, 2))
console.log(`Generated ${cafes.length} cafe entries`)
