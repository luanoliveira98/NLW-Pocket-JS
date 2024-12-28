import { count, gte, lte, and, eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

interface CreateGoalCompletionUseCaseRequest {
  goalId: string
}

export async function CreateGoalCompletionUseCase({
  goalId,
}: CreateGoalCompletionUseCaseRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const [{ completionCount, desiredWeeklyFrequency }] = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
              COALESCE(${goalCompletionCounts.completionCount}, 0)
            `.mapWith(Number),
    })
    .from(goals)
    .where(eq(goals.id, goalId))
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .limit(1)

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')
  }

  const [goalCompletion] = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  return { goalCompletion }
}
