import { Share } from 'react-native';
import { shareURL } from '../assets/EnumString';
//share the positng
const onShare = async (postingId) => {
  try {
    const result = await Share.share({
      message: `${shareURL}${postingId}`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Yes", `${shareURL}${postingId}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export { onShare };
