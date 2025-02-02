import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lock } from 'lucide-react';
import { StatCard, StatCardProps, CriticalStats, CriticalStatsProps } from './StatComponents';

interface DraggableProps {
  id: string;
  isLocked?: boolean;
}

export const DraggableStatCard = memo(({
  id,
  isLocked = false,
  ...props
}: DraggableProps & Omit<StatCardProps, 'onClick'>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${!isLocked ? 'cursor-move' : 'cursor-not-allowed'}`}
      {...attributes}
      {...(!isLocked ? listeners : {})}
    >
      <StatCard {...props} />
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  );
});

DraggableStatCard.displayName = 'DraggableStatCard';

export const DraggableCriticalStats = memo(({
  id,
  isLocked = true,
  ...props
}: DraggableProps & CriticalStatsProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative cursor-not-allowed"
      {...attributes}
      {...(!isLocked ? listeners : {})}
    >
      <CriticalStats {...props} />
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  );
});

DraggableCriticalStats.displayName = 'DraggableCriticalStats';
