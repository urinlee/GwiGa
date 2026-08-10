import type { Preview } from '@storybook/nextjs-vite'
import "../src/app/globals.css";
import { ThemeProvider } from 'next-themes';
 
import { withThemeByClassName } from '@storybook/addon-themes';
import { QueryProvider } from '../src/components/common/QueryProvider';


const preview: Preview = {
  
  parameters: {
    // 앱이 전부 app router라 useRouter를 쓰는 컴포넌트가 스토리에서도 뜨게 한다
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },decorators: [

    // useQuery를 쓰는 컴포넌트(EventSelect·EventList 등)가 앱과 같은 조건에서 렌더되도록
    (Story) => (

      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Story />
        </ThemeProvider>
      </QueryProvider>

    ),
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),

  ],
};

export default preview;