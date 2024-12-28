import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { CreateGoalCompletionUseCase } from '../../use-cases/create-goal-completion.use-case'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body

      await CreateGoalCompletionUseCase({
        goalId,
      })
    }
  )
}
