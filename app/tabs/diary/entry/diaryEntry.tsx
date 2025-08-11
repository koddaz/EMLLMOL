import { AppData } from "@/app/constants/interface/appData"; // Add this import
import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";

export function DiaryEntry({ 
  appData, 
  setToggleEntry, 
  diaryData 
}: { 
  appData: AppData, 
  setToggleEntry: (state: boolean) => void,
  diaryData: DiaryData // Add this prop
}) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  return (
    <Card>
      <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
      <Card.Content>
        <Text variant="titleLarge">Card title</Text>
        <Text variant="bodyMedium">Card content</Text>
      </Card.Content>
      
      <Card.Actions>
        <Button onPress={() => setToggleEntry(false)}>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
}