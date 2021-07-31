import dynamic from 'next/dynamic';

import { Box, Flex, SimpleGrid, Text, theme } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const options = {
  chart: {
    toobar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray['500'],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tootip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray['600'],
    },
    axisTicks: {
      color: theme.colors.gray['600'],
    },
    categories: [
      '2021-03-18T00:00:00.000z',
      '2021-03-19T00:00:00.000z',
      '2021-03-20T00:00:00.000z',
      '2021-03-21T00:00:00.000z',
      '2021-03-22T00:00:00.000z',
      '2021-03-23T00:00:00.000z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'drak',
      opacityFrom: '0.7',
      opacityTo: '0.3',
    },
  },
};
const series = [
  {
    name: 'Serie1',
    data: [31, 120, 30, 66, 12, 99],
  },
];

export default function Dashboard() {
  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex as="main" w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          align="flex-start"
        >
          <Box p="8" bg="gray.800" borderRadius="8" pb="4">
            <Text fontSize="lg" mb="4">
              Subscribers of the week
            </Text>
            <Chart
              type="area"
              height={160}
              options={options}
              series={series}
            />
          </Box>

          <Box p="8" bg="gray.800" borderRadius="8" pb="4">
            <Text fontSize="lg" mb="4">
              Opening frequency
              <Chart
                type="area"
                height={160}
                options={options}
                series={series}
              />
            </Text>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
