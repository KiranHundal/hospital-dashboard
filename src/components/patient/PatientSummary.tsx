import { useState, useEffect, memo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Users, Activity, Clock } from 'lucide-react';
import { usePatientStats } from '../../hooks/usePatientStats';
import { LayoutItem } from '../../types/dashboard';
import { DraggableCriticalStats, DraggableStatCard } from './DraggableStatComponents';
import { Patient } from '../../types/patient';
import { FilterCriteria } from '../../utils/filterUtils';
import { StatCardProps } from './StatComponents';

interface PatientSummaryProps {
  patients: Patient[];
  className?: string;
  onFilterChange?: (criteria: FilterCriteria) => void;
}

const defaultLayout: LayoutItem[] = [
  {
    id: 'critical-stats',
    type: 'critical',
    title: 'Critical Stats',
    isLocked: true,
  },
  {
    id: 'total-patients',
    type: 'stat',
    title: 'Total Patients',
  },
  {
    id: 'average-age',
    type: 'stat',
    title: 'Average Age',
  },
  {
    id: 'gender-distribution',
    type: 'stat',
    title: 'Gender Distribution',
  },
];

export const PatientSummary = memo(({
  patients,
  className = "",
  onFilterChange
}: PatientSummaryProps) => {
  const stats = usePatientStats(patients);
  const maleCount = patients.filter(p => p.gender.toLowerCase() === "male").length;
  const femaleCount = patients.filter(p => p.gender.toLowerCase() === "female").length;

  const patientsDueForVitals = patients.filter((patient) => {
    const lastVitalsTime = patient.vitals?.timestamp;
    if (!lastVitalsTime) return true;
    const timeSinceLastVitals = Date.now() - new Date(lastVitalsTime).getTime();
    return timeSinceLastVitals > 60 * 60 * 1000;
  });

  const [layout, setLayout] = useState<LayoutItem[]>(() => {
    const saved = localStorage.getItem('patientSummaryLayout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  useEffect(() => {
    localStorage.setItem('patientSummaryLayout', JSON.stringify(layout));
  }, [layout]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeItem = layout.find(item => item.id === active.id);
    if (activeItem?.isLocked) return;

    const oldIndex = layout.findIndex(item => item.id === active.id);
    const newIndex = layout.findIndex(item => item.id === over.id);

    setLayout(arrayMove(layout, oldIndex, newIndex));
  };

  const handleCriticalClick = () => {
    if (onFilterChange) {
      onFilterChange({
        criticalVitals: {
          highBP: stats.criticalPatients.highBP > 0,
          lowOxygen: stats.criticalPatients.lowO2 > 0,
          abnormalHeartRate: stats.criticalPatients.lowHR > 0
        }
      });
    }
  };

  const renderCard = (item: LayoutItem) => {
    if (item.type === 'critical') {
      return (
        <DraggableCriticalStats
          key={item.id}
          id={item.id}
          stats={{
            criticalPatients: stats.criticalPatients
          }}
          highlight={patientsDueForVitals.length > 0}
          isLocked={item.isLocked}
          onClick={handleCriticalClick}
        />
      );
    }

    const cardProps: Omit<StatCardProps, 'onClick'> & { id: string; isLocked?: boolean } = {
      id: item.id,
      isLocked: item.isLocked,
      title: item.title,
      value: '',
      icon: null,
      description: '',
    };

    switch (item.id) {
      case 'total-patients':
        cardProps.value = stats.totalPatients.toString();
        cardProps.icon = <Users size={24} />;
        break;
      case 'average-age':
        cardProps.value = `${stats.averageAge} years`;
        cardProps.icon = <Clock size={24} />;
        break;
      case 'gender-distribution':
        cardProps.value = `${maleCount}M / ${femaleCount}F`;
        cardProps.icon = <Activity size={24} />;
        cardProps.description = "Male / Female";
        break;
    }

    return <DraggableStatCard key={item.id} {...cardProps} />;
  };

  return (
    <div className={`mb-8 ${className}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SortableContext
            items={layout.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            {layout.map(renderCard)}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
});

PatientSummary.displayName = 'PatientSummary';
