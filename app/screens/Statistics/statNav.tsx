import { useAppTheme } from "@/app/constants/UI/theme";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function StatNav() {

    const { styles, theme } = useAppTheme();

    return (
        <View style={styles.background}>
        </View>
    );

}

export function StatisticsScreen({ navigation }: { navigation: any }) {

    const { styles, theme } = useAppTheme();

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                
            </View>

        </View>
    );
}