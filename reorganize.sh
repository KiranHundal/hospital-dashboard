#!/bin/bash

# Create new directory structure
mkdir -p src/components/layout/Dashboard
mkdir -p src/components/patient/cards
mkdir -p src/components/patient/table
mkdir -p src/components/patient/stats
mkdir -p src/components/patient/filter
mkdir -p src/components/patient/comparison
mkdir -p src/components/shared
mkdir -p src/components/ui

# Move Dashboard-related files
mv src/components/layout/Dashboard.tsx src/components/layout/Dashboard/index.tsx
mv src/components/layout/Header.tsx src/components/layout/Dashboard/DashboardHeader.tsx
mv src/components/layout/SplitScreenDashboard.tsx src/components/layout/Dashboard/

# Move Patient-related files
mv src/components/patient/ExpandablePatientCard.tsx src/components/patient/cards/
mv src/components/patient/PatientTable.tsx src/components/patient/table/
mv src/components/patient/SortedPatientTable.tsx src/components/patient/table/
mv src/components/patient/SortedTableHeader.tsx src/components/patient/table/
mv src/components/patient/PatientRow.tsx src/components/patient/table/

# Move Stats-related files
mv src/components/patient/StatComponents.tsx src/components/patient/stats/
mv src/components/patient/DraggableStatComponent.tsx src/components/patient/stats/
mv src/components/patient/VitalsDisplay.tsx src/components/patient/stats/

# Move Filter-related files
mv src/components/patient/PatientFilterPanel.tsx src/components/patient/filter/

# Move Comparison-related files
mv src/components/patient/ComparisonNotes.tsx src/components/patient/comparison/
mv src/components/patient/VitalsComparison.tsx src/components/patient/comparison/

# Move Summary file
mv src/components/patient/PatientSummary.tsx src/components/patient/

# Move Shared components
mv src/components/shared/SortableData.tsx src/components/shared/

# Move UI components
mv src/components/ui/ConnectionStatus.tsx src/components/ui/
mv src/components/ui/ErrorMessage.tsx src/components/ui/
mv src/components/ui/LoadingSpinner.tsx src/components/ui/
mv src/components/ui/PaginationControls.tsx src/components/ui/
mv src/components/ui/SearchAndFilterBar.tsx src/components/ui/
mv src/components/ui/Toast.tsx src/components/ui/

# Create new Dashboard component files
touch src/components/layout/Dashboard/DashboardControls.tsx
touch src/components/layout/Dashboard/DashboardContent.tsx
touch src/components/layout/Dashboard/types.ts

# Create README files to document structure
echo "# Dashboard Components
This directory contains the main dashboard layout components." > src/components/layout/Dashboard/README.md

echo "# Patient Components
This directory contains all patient-related components." > src/components/patient/README.md

echo "# UI Components
This directory contains reusable UI components." > src/components/ui/README.md

# Print success message
echo "Directory structure has been reorganized successfully!"
echo "Don't forget to update your import statements in the files!"
