import { TopContainer } from "@/app/components/topContainer";

interface SettingsHeaderProps {
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
}

export function SettingsHeader({ editMode, setEditMode }: SettingsHeaderProps) {
    return (
        <TopContainer
            title="Settings"
            mainIcon="cog"
            actionButtons={[
                {
                    icon: "information",
                    onPress: () => console.log('Info pressed')
                },
                {
                    icon: "shield-account", 
                    onPress: () => console.log('Privacy pressed')
                }
            ]}
        />
    );
}