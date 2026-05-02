import { Notification } from "../components/NotificationList";

const TYPE_WEIGHT: Record<Notification["type"], number> = {
  placement: 3,
  result: 2,
  event: 1,
};

const computeScore = (n: Notification): number => {
  const typeWeight = TYPE_WEIGHT[n.type];
  const epochMs = new Date(n.timestamp).getTime();
  const recencyWeight = epochMs / 1e13;
  return typeWeight + recencyWeight;
};

class MaxHeap {
  private heap: Notification[] = [];

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private rightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private compare(a: Notification, b: Notification): number {
    return computeScore(b) - computeScore(a);
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = this.parentIndex(i);
      if (this.compare(this.heap[parent], this.heap[i]) > 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const size = this.heap.length;
    while (true) {
      let best = i;
      const left = this.leftChildIndex(i);
      const right = this.rightChildIndex(i);

      if (left < size && this.compare(this.heap[best], this.heap[left]) > 0) {
        best = left;
      }
      if (right < size && this.compare(this.heap[best], this.heap[right]) > 0) {
        best = right;
      }

      if (best !== i) {
        this.swap(i, best);
        i = best;
      } else {
        break;
      }
    }
  }

  insert(notification: Notification): void {
    this.heap.push(notification);
    this.siftUp(this.heap.length - 1);
  }

  extractMax(): Notification | undefined {
    if (this.heap.length === 0) return undefined;
    const max = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return max;
  }

  size(): number {
    return this.heap.length;
  }
}

export const getTopNPrioritized = (
  notifications: Notification[],
  n: number
): Notification[] => {
  const heap = new MaxHeap();

  for (const notification of notifications) {
    heap.insert(notification);
  }

  const result: Notification[] = [];
  const limit = Math.min(n, notifications.length);

  for (let i = 0; i < limit; i++) {
    const top = heap.extractMax();
    if (top) result.push(top);
  }

  return result;
};

export const insertAndMaintainTopN = (
  currentTopN: Notification[],
  allNotifications: Notification[],
  newNotification: Notification,
  n: number
): { topN: Notification[]; all: Notification[] } => {
  const updatedAll = [...allNotifications, newNotification];
  const topN = getTopNPrioritized(updatedAll, n);
  return { topN, all: updatedAll };
};

export { computeScore, TYPE_WEIGHT };
