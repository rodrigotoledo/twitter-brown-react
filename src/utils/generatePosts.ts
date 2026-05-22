import { faker } from '@faker-js/faker'
import type { Post } from '../types/post'

export const generatePosts = (count = 50): Post[] =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    author: {
      name: faker.person.fullName(),
      username: faker.internet.username().toLowerCase(),
      avatar: faker.image.avatar(),
    },
    content: faker.lorem.paragraph({ min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 365 }),
    likes: faker.number.int({ min: 0, max: 5000 }),
    reposts: faker.number.int({ min: 0, max: 1000 }),
    comments: faker.number.int({ min: 0, max: 500 }),
    isFollowing: faker.datatype.boolean(),
  })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
