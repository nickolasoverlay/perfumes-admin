import React from "react"
import { ClickAwayListener, Grow, Paper, Popper, MenuList } from "@material-ui/core"

const Menu = props => {
  const handleListKeyDown = event => {
    if (event.key === "Tab") {
      event.preventDefault()
    }
  }

  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorEl}
      role={undefined}
      transition
      disablePortal
      style={{ zIndex: "99" }}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom", borderRadius: "6px" }}
        >
          <Paper>
            <ClickAwayListener onClickAway={props.onClose}>
              <MenuList autoFocusItem={props.open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {props.children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

export default Menu
