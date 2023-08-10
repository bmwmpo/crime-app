import { Share } from 'react-native';
import { SHARE_URL } from '../assets/EnumString';
//share the positng
const onShare = async (postingId) => {
  try {
    const result = await Share.share({
      message: `${SHARE_URL}${postingId}`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Yes", `${SHARE_URL}${postingId}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export { onShare };
