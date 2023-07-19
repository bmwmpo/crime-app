import { IconButton, Menu } from "react-native-paper";

//menu component
const MenuComponent = ({
  menuVisible,
  hideMenu,
  openMenu,
  textColor,
  setShowConfirmDialog,
}) => {
  return (
    <Menu
      visible={menuVisible}
      onDismiss={hideMenu}
      anchor={
        <IconButton
          onPress={openMenu}
          icon="dots-vertical"
          textColor={textColor.color}
        ></IconButton>
      }
      anchorPosition="bottom"
    >
      {/* delete option */}
      <Menu.Item
        title="delete"
        onPress={() => {
          setShowConfirmDialog(true);
          hideMenu();
        }}
      />
    </Menu>
  );
};

export default MenuComponent;
