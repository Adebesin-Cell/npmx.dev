<script setup lang="ts">
import type { Comment } from '#shared/types/blog-post'

const props = defineProps<{
  comment: Comment
}>()

interface FlatReply {
  comment: Comment
  replyingTo?: string
}

function flattenReplies(comment: Comment): FlatReply[] {
  const result: FlatReply[] = []
  function walk(replies: Comment[], parentName: string, isDirectReply: boolean) {
    for (const reply of replies) {
      result.push({
        comment: reply,
        replyingTo: isDirectReply ? undefined : parentName,
      })
      if (reply.replies.length > 0) {
        walk(reply.replies, reply.author.displayName || reply.author.handle, false)
      }
    }
  }
  walk(comment.replies, comment.author.displayName || comment.author.handle, true)
  return result
}

const flatReplies = computed(() => flattenReplies(props.comment))
const totalReplyCount = computed(() => flatReplies.value.length)
const showReplies = ref(false)
</script>

<template>
  <div>
    <!-- Top-level comment -->
    <BlueskyComment :comment="comment" />

    <!-- Replies section -->
    <div v-if="totalReplyCount > 0" class="ms-13 mt-2">
      <!-- Toggle button -->
      <button
        v-if="!showReplies"
        class="text-sm text-accent font-medium hover:underline cursor-pointer"
        @click="showReplies = true"
      >
        {{ $t('blog.atproto.view_replies', { count: totalReplyCount }, totalReplyCount) }}
      </button>

      <!-- Expanded replies -->
      <template v-else>
        <button
          class="text-sm text-accent font-medium hover:underline mb-3 cursor-pointer"
          @click="showReplies = false"
        >
          {{ $t('blog.atproto.hide_replies') }}
        </button>

        <div class="flex flex-col gap-4">
          <BlueskyComment
            v-for="reply in flatReplies"
            :key="reply.comment.uri"
            :comment="reply.comment"
            :replying-to="reply.replyingTo"
            is-reply
          />
        </div>
      </template>
    </div>
  </div>
</template>
