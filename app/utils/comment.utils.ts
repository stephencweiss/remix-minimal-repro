// TODO - move app/comments.utils.ts

// import type { SelectComment } from "app/db/schema";
// import { CommentTypes, FlatCommentServer } from "~/comments/comment.server";

/** A helper function to filter out private comments based on
 * 1. the requesting user,
 * 2. the privacy of the comment and,
 * 3. whether or not we want to include private comments
 */
export const filterPrivateComments = (comment: { isPrivate: boolean | null, submittedBy: string | null, }, requestingUserId: string) => {
  if (comment.isPrivate) {
    if (comment.submittedBy?.toLowerCase() != "anonymous" && comment.submittedBy == requestingUserId) return true;
    return false
  }
  return true;
}

// export const flattenAndAssociateComment = (
//   comment: SelectComment & {
//     usefulCount?: number, // TODO: once this is included in the db, remove this
//     user: { id: string, username: string | null, } | null,
//   },
//   { associatedId, commentType }: { associatedId: string; commentType: CommentTypes },
// ): FlatCommentServer => ({
//   ...comment,
//   submittedBy: comment.submittedBy ?? "Anonymous",
//   isPrivate: comment.isPrivate ?? false,
//   username: comment.user?.username ?? "Anonymous",
//   commentId: comment.id,
//   usefulCount: comment.usefulCount ?? 0,
//   associatedId,
//   commentType,
// })