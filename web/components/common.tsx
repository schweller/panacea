import { darkTheme, styled } from "../stitches.config"

export const Box = styled('div', {});
export const Flex = styled('div', { display: 'flex' });
export const Text = styled('div', {
    color: '$plum12',
    fontSize: 15,
    
    variants: {
        variant: {
            sand: {
                color: '$mauve12'
            }
        }
    },
    [`.${darkTheme} &`]: {
        color: '$plum12',
      },
});

export const List = styled('ul', {
    listStyle: "none"
})
export const ListItem = styled('li', {
    margin: '15px 0',
    variants: {
        variant: {
            default: {},
            card: {
                border: '1px solid',
                borderColor: "$amber7",
                borderRadius: 10,
            }
        }
    },

    defaultVariants: {
        variant: 'default'
    }
})

export const ListItemHeading = styled('div', {
    padding: 15,
    backgroundColor: '$amber6'
})

export const Heading = styled('h2', {
    color: '$amber11',
    margin: "0 0 5px 0"
})

export const Subheading = styled('h3', {
    color: '$amber11',
    fontSize: 16,
    fontWeight: 300,
})

export const Link = styled('a', {
    color: '$amber11',
})

export const StyledButton = styled('button', {
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
    borderWidth: 1,
    borderStyle: 'solid',
    color: '$mauve12',
    backgroundColor: '$plum1',
    borderColor: '$plum10',    
    '&:hover': { backgroundColor: '$plum4' },
    '&:focus': { boxShadow: `0 0 0 2px black` },
    '&[data-placeholder]': { color: '$amber11' },
  })