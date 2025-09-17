import { TopContainer } from "@/app/components/topContainer";
import { SegmentedButtons } from "react-native-paper";

interface StatisticsHeaderProps {
    selectedPeriod: number;
    selectedMealTypes: string[];
    setSelectedScreen: any;
    selectedScreen: string;
}

export function StatisticsHeader({ selectedPeriod, selectedMealTypes, setSelectedScreen, selectedScreen }: StatisticsHeaderProps) {
    return (
        <TopContainer
            title="Statistics"
            mainIcon="chart-line"
            rightChips={[
                {
                    icon: "calendar-range",
                    text: `${selectedPeriod}d`
                },
                {
                    icon: "food",
                    text: `${selectedMealTypes.length}`
                }
            ]}
        >
            <SegmentedButtons
                value={selectedScreen}
                onValueChange={setSelectedScreen}
                buttons={[
                    {
                        value: 'glucose',
                        label: 'Glucose',
                        icon: 'blood-bag',
                        style: { borderRadius: 8 },
                    },
                    {
                        value: 'carbs',
                        label: 'Carbs',
                        icon: 'food',
                    },
                    {
                        value: 'entries',
                        label: 'Entries',
                        icon: 'clipboard-list',
                        style: { borderRadius: 8 },
                    },
                ]}
            />
        </TopContainer>
    );
}