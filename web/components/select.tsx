import { violet, mauve } from "@radix-ui/colors"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import * as SelectPrimitive from '@radix-ui/react-select';
import { styled } from "../stitches.config"
import { Box } from "./common"
  
  const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: '0 15px',
    fontSize: 13,
    lineHeight: 1,
    height: 35,
    gap: 5,
    backgroundColor: '$plum1',
    color: '$mauve12',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '$plum10',
    '&:hover': { backgroundColor: '$plum4' },
    '&:focus': { boxShadow: `0 0 0 2px black` },
    '&[data-placeholder]': { color: '$plum11' },
  });
  
  const StyledIcon = styled(SelectPrimitive.SelectIcon, {
    color: '$mauve12',
  });
  
  const StyledContent = styled(SelectPrimitive.Content, {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow:
      '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  });
  
  const StyledViewport = styled(SelectPrimitive.Viewport, {
    padding: 5,
  });
  
  const StyledItem = styled(SelectPrimitive.Item, {
    all: 'unset',
    fontSize: 13,
    lineHeight: 1,
    color: '$mauve12',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    padding: '0 35px 0 25px',
    position: 'relative',
    userSelect: 'none',
  
    '&[data-disabled]': {
      color: mauve.mauve8,
      pointerEvents: 'none',
    },
  
    '&[data-highlighted]': {
      backgroundColor: '$plum9',
      color: '$plum3',
    },
  });
  
  const StyledLabel = styled(SelectPrimitive.Label, {
    padding: '0 25px',
    fontSize: 12,
    lineHeight: '25px',
    color: mauve.mauve11,
  });
  
  function Content({ children, ...props}: {children: React.ReactNode})  {
    return (
      <SelectPrimitive.Portal>
        <StyledContent {...props}>{children}</StyledContent>
      </SelectPrimitive.Portal>
    );
  }
  
  const scrollButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    backgroundColor: 'white',
    color: violet.violet11,
    cursor: 'default',
  };
  const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
    position: 'absolute',
    left: 0,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  
  const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);
  
  const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);
  
  const Select = SelectPrimitive.Root;
  const SelectTrigger = StyledTrigger;
  const SelectValue = SelectPrimitive.Value;
  const SelectIcon = StyledIcon;
  const SelectContent = Content;
  const SelectViewport = StyledViewport;
  const SelectGroup = SelectPrimitive.Group;
  const SelectItem = StyledItem;
  const SelectItemText = SelectPrimitive.ItemText;
  const SelectItemIndicator = StyledItemIndicator;
  const SelectLabel = StyledLabel;
  const SelectScrollUpButton = StyledScrollUpButton;
  const SelectScrollDownButton = StyledScrollDownButton;
  
  const SelectDemo = ({data, handler, value, placeholder}: {
    data: any,
    handler: any,
    value: any,
    placeholder: any
  }) => (
    <Box>
        <Select onValueChange={handler} value={value}>
        <SelectTrigger aria-label={placeholder}>
            <SelectValue placeholder={placeholder} />
            <SelectIcon>
              <ChevronDownIcon />
            </SelectIcon>
        </SelectTrigger>
        <SelectContent>
            <SelectScrollUpButton>
              <ChevronUpIcon />
            </SelectScrollUpButton>
            <SelectViewport>
            <SelectGroup>
                <SelectItem value="">
                    <SelectItemText>{placeholder}</SelectItemText>
                    <SelectItemIndicator>
                        <CheckIcon />
                    </SelectItemIndicator>
                </SelectItem>                
                {data.map((lang: string) => {
                    return (
                    <SelectItem key={lang} value={lang}>
                        <SelectItemText>{lang}</SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    )
                })}
            </SelectGroup>
            </SelectViewport>
            <SelectScrollDownButton>
            <ChevronDownIcon />
            </SelectScrollDownButton>
        </SelectContent>
        </Select>
    </Box>
  );

export default SelectDemo