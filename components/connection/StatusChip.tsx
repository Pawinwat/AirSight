import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

interface StatusChipProps<T extends { status: string }> {
    status: T;
    name: string;
}

export default function StatusChip<T extends { status: string }>({ name, status }: StatusChipProps<T>) {
    const severity = status?.status === 'healthy' ? 'success' : 'danger';



    return (
        <div>
        <Tag
            severity={severity}
            value={name?.slice(0, 1)} // Only show the first letter of the name
            rounded
            className="circular-tag"
            data-tooltip={name} // Add tooltip text
        />
        <Tooltip target=".circular-tag" />
    </div>
    );
}
