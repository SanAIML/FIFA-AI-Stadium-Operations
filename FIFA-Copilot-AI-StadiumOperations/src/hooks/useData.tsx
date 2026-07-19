import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getDashboard, getIncidents, getRecommendations, getMemory } from '@/lib/api';
import {
  incidents as mockIncidents,
  recommendations as mockRecommendations,
  operationalMemory as mockMemory,
  kpis as mockKpis,
  liveEvents as mockLiveEvents,
  timeline as mockTimeline,
  stadiumNodes as mockStadiumNodes,
  staffGroups as mockStaffGroups,
  contextSnapshot as mockContextSnapshot,
  crowdDensitySeries as mockCrowdDensitySeries,
  suggestedPrompts as mockSuggestedPrompts,
} from '@/lib/mock-data';
import {
  buildContextSnapshot,
  buildKpisFromDashboard,
  mapBackendIncident,
  mapBackendMemory,
  mapBackendRecommendation,
} from '@/services/mappers';
import type {
  ContextSnapshot,
  DashboardData,
  Incident,
  Kpi,
  LiveEvent,
  OperationalMemory,
  Recommendation,
  StaffGroup,
  StadiumNode,
  TimelineItem,
} from '@/lib/types';

export const REFRESH_INTERVAL_MS = 15000;

interface DataContextValue {
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
  dashboard: DashboardData | null;
  incidents: Incident[];
  recommendations: Recommendation[];
  memory: OperationalMemory[];
  kpis: Kpi[];
  liveEvents: LiveEvent[];
  timeline: TimelineItem[];
  stadiumNodes: StadiumNode[];
  staffGroups: StaffGroup[];
  contextSnapshot: ContextSnapshot;
  crowdDensitySeries: typeof mockCrowdDensitySeries;
  suggestedPrompts: string[];
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

function incidentsToLiveEvents(incidents: Incident[]): LiveEvent[] {
  return incidents.slice(0, 7).map((inc) => ({
    id: inc.id,
    time: inc.reportedAt,
    title: inc.title,
    detail: inc.description,
    severity: inc.severity,
    zone: inc.zone,
  }));
}

function incidentsToTimeline(incidents: Incident[]): TimelineItem[] {
  return incidents.slice(0, 5).map((inc, idx) => ({
    id: `t-${inc.id}`,
    time: inc.reportedAt,
    title: inc.title,
    description: inc.description,
    type: idx === 0 ? 'alert' : idx === 1 ? 'prediction' : 'action',
  }));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [memory, setMemory] = useState<OperationalMemory[]>([]);

  const applyDemoData = useCallback(() => {
    setIsDemoMode(true);
    setDashboard({
      activeIncidents: mockIncidents.length,
      criticalIncidents: mockIncidents.filter((i) => i.severity === 'critical').length,
      recommendations: mockRecommendations.length,
      operationalMemory: mockMemory.length,
      systemStatus: 'Operational',
      aiConfidence: 87,
    });
    setIncidents(mockIncidents);
    setRecommendations(mockRecommendations);
    setMemory(mockMemory);
    setError(null);
  }, []);

  const refetch = useCallback(async () => {
    try {
      const [dashboardRes, incidentsRes, recommendationsRes, memoryRes] = await Promise.all([
        getDashboard(),
        getIncidents(),
        getRecommendations(),
        getMemory(),
      ]);

      const mappedIncidents = incidentsRes.map(mapBackendIncident);
      const mappedRecommendations = recommendationsRes.map(mapBackendRecommendation);
      const mappedMemory = memoryRes.map((item, index) => mapBackendMemory(item, index));

      setDashboard(dashboardRes);
      setIncidents(mappedIncidents);
      setRecommendations(mappedRecommendations);
      setMemory(mappedMemory);
      setIsDemoMode(false);
      setError(null);
    } catch (err) {
      applyDemoData();
      setError(err instanceof Error ? err.message : 'Backend unavailable');
    } finally {
      setLoading(false);
    }
  }, [applyDemoData]);

  useEffect(() => {
    void refetch();
    const intervalId = window.setInterval(() => {
      void refetch();
    }, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [refetch]);

  const value = useMemo<DataContextValue>(() => {
    const kpis = isDemoMode || !dashboard ? mockKpis : buildKpisFromDashboard(dashboard, incidents);
    const contextSnapshot =
      isDemoMode || !dashboard
        ? mockContextSnapshot
        : buildContextSnapshot(dashboard, incidents, recommendations);

    return {
      loading,
      error,
      isDemoMode,
      dashboard,
      incidents,
      recommendations,
      memory,
      kpis,
      liveEvents: isDemoMode ? mockLiveEvents : incidentsToLiveEvents(incidents),
      timeline: isDemoMode ? mockTimeline : incidentsToTimeline(incidents),
      stadiumNodes: mockStadiumNodes,
      staffGroups: mockStaffGroups,
      contextSnapshot,
      crowdDensitySeries: mockCrowdDensitySeries,
      suggestedPrompts: mockSuggestedPrompts,
      refetch,
    };
  }, [
    loading,
    error,
    isDemoMode,
    dashboard,
    incidents,
    recommendations,
    memory,
    refetch,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export function useDashboardData() {
  const data = useData();
  return {
    loading: data.loading,
    error: data.error,
    isDemoMode: data.isDemoMode,
    dashboard: data.dashboard,
    kpis: data.kpis,
    incidents: data.incidents,
    recommendations: data.recommendations,
    memory: data.memory,
    liveEvents: data.liveEvents,
    timeline: data.timeline,
    stadiumNodes: data.stadiumNodes,
    staffGroups: data.staffGroups,
    crowdDensitySeries: data.crowdDensitySeries,
    suggestedPrompts: data.suggestedPrompts,
    contextSnapshot: data.contextSnapshot,
    refetch: data.refetch,
  };
}

export function useIncidentsData() {
  const { loading, error, isDemoMode, incidents, refetch } = useData();
  return { loading, error, isDemoMode, incidents, refetch };
}

export function useRecommendationsData() {
  const { loading, error, isDemoMode, recommendations, refetch } = useData();
  return { loading, error, isDemoMode, recommendations, refetch };
}

export function useMemoryData() {
  const { loading, error, isDemoMode, memory, refetch } = useData();
  return { loading, error, isDemoMode, memory, refetch };
}

export function useChatContext() {
  const { incidents, recommendations, memory, dashboard, isDemoMode } = useData();
  return { incidents, recommendations, memory, dashboard, isDemoMode };
}
