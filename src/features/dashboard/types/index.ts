export interface DashboardStat {
    label: string;
    value: string;
    color: string;
}

export interface ActivityItem {
    title: string;
    desc: string;
    status: 'success' | 'info' | 'warning' | 'error';
}

export interface ServiceStatus {
    name: string;
    status: 'Online' | 'Offline' | 'Degraded';
}
