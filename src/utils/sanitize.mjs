export function sanitizeDocument(doc) {
  const clone = { ...doc };

  // Convert ObjectId to string
  if (clone._id && clone._id.toString) clone._id = clone._id.toString();

  // Also handle nested actor, target, etc.
  if (clone.actor && typeof clone.actor === 'object' && clone.actor.toString)
    clone.actor = clone.actor.toString();

  if (clone.target && typeof clone.target === 'object' && clone.target.toString)
    clone.target = clone.target.toString();

  return clone;
}
