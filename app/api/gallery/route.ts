import { sql } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

interface Photo {
  id: string
  url: string
  caption: string
  date: string
}

// Initialize the database table
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_photos (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        caption TEXT,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

export async function GET() {
  try {
    await initializeDatabase()

    const photos = await sql<Photo>`
      SELECT id, url, caption, date FROM gallery_photos
      ORDER BY created_at DESC
    `

    return NextResponse.json(photos.rows)
  } catch (error) {
    console.error("Failed to fetch photos:", error)
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const photos: Photo[] = await request.json()

    // Delete all existing photos
    await sql`DELETE FROM gallery_photos`

    // Insert new photos
    for (const photo of photos) {
      await sql`
        INSERT INTO gallery_photos (id, url, caption, date)
        VALUES (${photo.id}, ${photo.url}, ${photo.caption}, ${photo.date})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save photos:", error)
    return NextResponse.json(
      { error: "Failed to save photos" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM gallery_photos WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete photo:", error)
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    )
  }
}
