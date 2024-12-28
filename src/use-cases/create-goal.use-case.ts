import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalUseCaseRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoalUseCase({
  title,
  desiredWeeklyFrequency,
}: CreateGoalUseCaseRequest) {
  const [goal] = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  return { goal }
}
