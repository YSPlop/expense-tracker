import type { QuickAddSession } from '@/types/quick-add';
import { buildQuickAddLiveActivityLayout } from '@/widgets/QuickAddLiveActivity';

type LiveActivityModule = {
  startActivity: (
    state: ReturnType<typeof buildQuickAddLiveActivityLayout>,
    config?: { deepLinkUrl?: string },
    relevanceScore?: number
  ) => string | undefined;
  updateActivity: (
    id: string,
    state: ReturnType<typeof buildQuickAddLiveActivityLayout>,
    relevanceScore?: number
  ) => void;
  stopActivity: (
    id: string,
    state: ReturnType<typeof buildQuickAddLiveActivityLayout>,
    relevanceScore?: number
  ) => void;
};

let activityId: string | null = null;
let loadedModule: LiveActivityModule | null = null;
let loadAttempted = false;

function getModule() {
  if (loadedModule || loadAttempted) return loadedModule;
  loadAttempted = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loadedModule = require('expo-live-activity') as LiveActivityModule;
    return loadedModule;
  } catch {
    return null;
  }
}

export function startQuickAddLiveActivity(session: QuickAddSession) {
  const module = getModule();
  if (!module) return;
  activityId = module.startActivity(buildQuickAddLiveActivityLayout(session), {
    deepLinkUrl: '/quick-add',
  }) ?? null;
}

export function syncQuickAddLiveActivity(session: QuickAddSession) {
  const module = getModule();
  if (!module || !activityId) return;
  module.updateActivity(activityId, buildQuickAddLiveActivityLayout(session));
}

export async function endQuickAddLiveActivity() {
  const module = getModule();
  if (!module || !activityId) return;
  module.stopActivity(activityId, buildQuickAddLiveActivityLayout({
    ...sessionEndState,
  }));
  activityId = null;
}

const sessionEndState: QuickAddSession = {
  isActive: false,
  step: 'confirm',
  type: null,
  amount: 0,
  categoryId: null,
};
