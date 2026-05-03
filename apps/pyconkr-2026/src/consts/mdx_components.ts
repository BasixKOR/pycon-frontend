// 후대의 개발자님께 : 컴포넌트 맨 첫글자가 대문자로 시작하지 않으면 JSX 컴포넌트가 아니라 일반 HTML 태그로 인식합니다. 제발 대문자로 시작해주세요.
import { Components, Schemas } from "@frontend/common";
import * as Shop from "@frontend/shop";
import * as mui from "@mui/material";
import type { MDXComponents } from "mdx/types.js";
import * as React from "react";

import PyCon2025HostLogoBig from "../../../../packages/common/src/assets/pyconkr2025_hostlogo_big.png";
import PyCon2025HostLogoSmall from "../../../../packages/common/src/assets/pyconkr2025_hostlogo_small.png";
import PyCon2025MobileLogoImage from "../../../../packages/common/src/assets/pyconkr2025_main_cover_image.png";
import PyCon2025MobileLogoTitle from "../../../../packages/common/src/assets/pyconkr2025_main_cover_title.png";
import PyCon2025Logo from "../../../../packages/common/src/assets/pyconkr2025_logo.png";

const MUIMDXComponents: MDXComponents = {
  Mui__material__Accordion: mui.Accordion,
  Mui__material__AccordionActions: mui.AccordionActions,
  Mui__material__AccordionDetails: mui.AccordionDetails,
  Mui__material__AccordionSummary: mui.AccordionSummary,
  Mui__material__Alert: mui.Alert,
  Mui__material__AlertTitle: mui.AlertTitle,
  Mui__material__AppBar: mui.AppBar,
  Mui__material__Autocomplete: mui.Autocomplete,
  Mui__material__Avatar: mui.Avatar,
  Mui__material__AvatarGroup: mui.AvatarGroup,
  Mui__material__Backdrop: mui.Backdrop,
  Mui__material__Badge: mui.Badge,
  Mui__material__BottomNavigation: mui.BottomNavigation,
  Mui__material__BottomNavigationAction: mui.BottomNavigationAction,
  Mui__material__Box: mui.Box,
  Mui__material__Breadcrumbs: mui.Breadcrumbs,
  Mui__material__Button: mui.Button,
  Mui__material__ButtonBase: mui.ButtonBase,
  Mui__material__ButtonGroup: mui.ButtonGroup,
  Mui__material__Card: mui.Card,
  Mui__material__CardActionArea: mui.CardActionArea,
  Mui__material__CardActions: mui.CardActions,
  Mui__material__CardContent: mui.CardContent,
  Mui__material__CardHeader: mui.CardHeader,
  Mui__material__CardMedia: mui.CardMedia,
  Mui__material__Checkbox: mui.Checkbox,
  Mui__material__Chip: mui.Chip,
  Mui__material__CircularProgress: mui.CircularProgress,
  Mui__material__Collapse: mui.Collapse,
  Mui__material__Container: mui.Container,
  Mui__material__Dialog: mui.Dialog,
  Mui__material__DialogActions: mui.DialogActions,
  Mui__material__DialogContent: mui.DialogContent,
  Mui__material__DialogContentText: mui.DialogContentText,
  Mui__material__DialogTitle: mui.DialogTitle,
  Mui__material__Divider: mui.Divider,
  Mui__material__Drawer: mui.Drawer,
  Mui__material__Fab: mui.Fab,
  Mui__material__Fade: mui.Fade,
  Mui__material__FilledInput: mui.FilledInput,
  Mui__material__FormControl: mui.FormControl,
  Mui__material__FormControlLabel: mui.FormControlLabel,
  Mui__material__FormGroup: mui.FormGroup,
  Mui__material__FormHelperText: mui.FormHelperText,
  Mui__material__FormLabel: mui.FormLabel,
  Mui__material__Grid: mui.Grid,
  Mui__material__Grow: mui.Grow,
  Mui__material__Icon: mui.Icon,
  Mui__material__IconButton: mui.IconButton,
  Mui__material__ImageList: mui.ImageList,
  Mui__material__ImageListItem: mui.ImageListItem,
  Mui__material__ImageListItemBar: mui.ImageListItemBar,
  Mui__material__Input: mui.Input,
  Mui__material__InputAdornment: mui.InputAdornment,
  Mui__material__InputBase: mui.InputBase,
  Mui__material__InputLabel: mui.InputLabel,
  Mui__material__LinearProgress: mui.LinearProgress,
  Mui__material__Link: mui.Link,
  Mui__material__List: mui.List,
  Mui__material__ListItem: mui.ListItem,
  Mui__material__ListItemAvatar: mui.ListItemAvatar,
  Mui__material__ListItemButton: mui.ListItemButton,
  Mui__material__ListItemIcon: mui.ListItemIcon,
  Mui__material__ListItemSecondaryAction: mui.ListItemSecondaryAction,
  Mui__material__ListItemText: mui.ListItemText,
  Mui__material__ListSubheader: mui.ListSubheader,
  Mui__material__Menu: mui.Menu,
  Mui__material__MenuItem: mui.MenuItem,
  Mui__material__MenuList: mui.MenuList,
  Mui__material__MobileStepper: mui.MobileStepper,
  Mui__material__Modal: mui.Modal,
  Mui__material__NativeSelect: mui.NativeSelect,
  Mui__material__NoSsr: mui.NoSsr,
  Mui__material__OutlinedInput: mui.OutlinedInput,
  Mui__material__Pagination: mui.Pagination,
  Mui__material__PaginationItem: mui.PaginationItem,
  Mui__material__Paper: mui.Paper,
  Mui__material__Popover: mui.Popover,
  Mui__material__Popper: mui.Popper,
  Mui__material__Portal: mui.Portal,
  Mui__material__Radio: mui.Radio,
  Mui__material__RadioGroup: mui.RadioGroup,
  Mui__material__Rating: mui.Rating,
  Mui__material__Select: mui.Select,
  Mui__material__Skeleton: mui.Skeleton,
  Mui__material__Slide: mui.Slide,
  Mui__material__Slider: mui.Slider,
  Mui__material__Snackbar: mui.Snackbar,
  Mui__material__SnackbarContent: mui.SnackbarContent,
  Mui__material__SpeedDial: mui.SpeedDial,
  Mui__material__SpeedDialAction: mui.SpeedDialAction,
  Mui__material__SpeedDialIcon: mui.SpeedDialIcon,
  Mui__material__Stack: mui.Stack,
  Mui__material__Step: mui.Step,
  Mui__material__StepButton: mui.StepButton,
  Mui__material__StepConnector: mui.StepConnector,
  Mui__material__StepContent: mui.StepContent,
  Mui__material__StepIcon: mui.StepIcon,
  Mui__material__StepLabel: mui.StepLabel,
  Mui__material__Stepper: mui.Stepper,
  Mui__material__SvgIcon: mui.SvgIcon,
  Mui__material__SwipeableDrawer: mui.SwipeableDrawer,
  Mui__material__Switch: mui.Switch,
  Mui__material__Tab: mui.Tab,
  Mui__material__Table: mui.Table,
  Mui__material__TableBody: mui.TableBody,
  Mui__material__TableCell: mui.TableCell,
  Mui__material__TableContainer: mui.TableContainer,
  Mui__material__TableFooter: mui.TableFooter,
  Mui__material__TableHead: mui.TableHead,
  Mui__material__TablePagination: mui.TablePagination,
  Mui__material__TableRow: mui.TableRow,
  Mui__material__TableSortLabel: mui.TableSortLabel,
  Mui__material__Tabs: mui.Tabs,
  Mui__material__TabScrollButton: mui.TabScrollButton,
  Mui__material__TextField: mui.TextField,
  Mui__material__TextareaAutosize: mui.TextareaAutosize,
  Mui__material__ToggleButton: mui.ToggleButton,
  Mui__material__ToggleButtonGroup: mui.ToggleButtonGroup,
  Mui__material__Toolbar: mui.Toolbar,
  Mui__material__Tooltip: mui.Tooltip,
  Mui__material__Typography: mui.Typography,
  Mui__material__Zoom: mui.Zoom,
};

const getPyConKR2025SessionUrl = (session: Schemas.BackendAPI.SessionSchema): string => {
  const urlSafeTitle = session.title
    .replace(/ /g, "-")
    .replace(/([.])/g, "_")
    .replace(/(?![.0-9A-Za-zㄱ-ㅣ가-힣-])./g, "");
  return `/presentations/${session.id}#${urlSafeTitle}`;
};

const PyConKR2025FallbackImage = React.createElement("img", {
  src: PyCon2025Logo,
  alt: "PyCon 2025 Logo",
  style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
});

const PyConKR2025SessionList: React.FC<React.ComponentProps<typeof Components.MDX.SessionList>> = (props) =>
  React.createElement(Components.MDX.SessionList, {
    ...props,
    fallbackImage: PyConKR2025FallbackImage,
    getSessionUrl: getPyConKR2025SessionUrl,
  });

const PyConKR2025SessionTimeTable: React.FC<React.ComponentProps<typeof Components.MDX.SessionTimeTable>> = (props) =>
  React.createElement(Components.MDX.SessionTimeTable, {
    ...props,
    getSessionUrl: getPyConKR2025SessionUrl,
  });

const PyConKR2025MobileAccordion: React.FC<object> = () =>
  React.createElement(Components.MDX.MobileAccordion, {
    marqueeText: "AUG 15 - 17",
    marqueeLogoSrc: PyCon2025HostLogoSmall,
    hostLogoBigSrc: PyCon2025HostLogoBig,
    venueKo: "서울특별시 중구 필동로 1길 30 동국대학교 신공학관",
    venueEnLines: ["New Engineering Building, Dongguk University", "Pildong-ro 1-gil, Jung-gu, Seoul, Republic of Korea"],
  });

const PyConKR2025MobileCover: React.FC<object> = () =>
  React.createElement(Components.MDX.MobileCover, {
    coverImageSrc: PyCon2025MobileLogoImage,
    coverTitleSrc: PyCon2025MobileLogoTitle,
  });

const PyConKRCommonMDXComponents: MDXComponents = {
  Common__Components__Lottie: Components.LottiePlayer,
  Common__Components__NetworkLottie: Components.NetworkLottiePlayer,
  Common__Components__MDX__Confetti: Components.MDX.Confetti,
  Common__Components__MDX__PrimaryStyledDetails: Components.MDX.PrimaryStyledDetails,
  Common__Components__MDX__SecondaryStyledDetails: Components.MDX.SecondaryStyledDetails,
  Common__Components__MDX__Map: Components.MDX.Map,
  Common__Components__MDX__FAQAccordion: Components.MDX.FAQAccordion,
  Common__Components__MDX__FullWidthStyledButton: Components.MDX.StyledFullWidthButton,
  Common__Components__Session__List: PyConKR2025SessionList,
  Common__Components__Session__TimeTable: PyConKR2025SessionTimeTable,
  Common__Components__MDX__MobileAccordion: PyConKR2025MobileAccordion,
  Common__Components__MDX__MobileCover: PyConKR2025MobileCover,
};

const PythonKRShopMDXComponents: MDXComponents = {
  Shop__Common__PriceDisplay: Shop.Components.Common.PriceDisplay,
  Shop__Common__SignInGuard: Shop.Components.Common.SignInGuard,
  Shop__Common__ContextProvider: Shop.Components.Common.ShopContextProvider,
  Shop__Common__UserSignInMethod: Shop.Components.Common.UserSignInMethod,
  Shop__Common__UserSignInAccount: Shop.Components.Common.UserSignInAccount,
  Shop__Feature__CartStatus: Shop.Components.Features.CartStatus,
  Shop__Feature__ProductList: Shop.Components.Features.ProductList,
  Shop__Feature__ProductImageCardList: Shop.Components.Features.ProductImageCardList,
  Shop__Feature__OrderList: Shop.Components.Features.OrderList,
  Shop__Feature__UserInfo: Shop.Components.Features.UserInfo,
  Shop__Feature__PatronList: Shop.Components.Features.PatronList,
};

export const PyConKRMDXComponents = {
  ...MUIMDXComponents,
  ...PyConKRCommonMDXComponents,
  ...PythonKRShopMDXComponents,
};
