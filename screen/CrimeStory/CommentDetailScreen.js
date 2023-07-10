import { View, Text } from "react-native";

const CommentDetailScreen = ({ route }) =>
{
    const { postingId } = route.params;
    return (<View><Text>{ postingId }</Text></View>);
}

export default CommentDetailScreen;