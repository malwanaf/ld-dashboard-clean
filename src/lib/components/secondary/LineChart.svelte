<script lang="ts">
    import { Chart, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { strikesresult } from '$lib/stores/strikes.ts';
    import { format, subDays, startOfDay, endOfDay } from 'date-fns';
    import * as Card from "$lib/components/ui/card";

    const getColor = (intensity) => {
        if (intensity <= 5) return 'green';
        else if (intensity > 5 && intensity <= 10) return 'orange';
        else return 'red';
    };

    let selectedData = [];
    let allData = [];

    const updateChart = () => {
        const categories = selectedData.map(d => format(new Date(d.time), 'HH:mm:ss'));
        const data = selectedData.map(d => ({
            x: format(new Date(d.time), 'HH:mm:ss'),
            y: d.distance,
            fillColor: getColor(d.intensity)
        }));

        options.xaxis.categories = categories;
        options.series[0].data = data.map(d => d.y);
        options.colors = data.map(d => d.fillColor);
    };

    const options = {
        series: [
            {
                name: 'Lightning Distance',
                data: []
            }
        ],
        colors: [],
        chart: {
            type: 'bar',
            height: '240px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: true
            },
            background: 'rgba(0, 0, 0, 0)', // Latar belakang hitam dengan opacity 50%
            foreColor: '#FFFFFF', // Warna teks putih
            border: {
                borderColor: '#FFFFFF', // Warna border putih
                borderWidth: 1, // Lebar border
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '30%', // Lebar bar diperkecil
                borderRadiusApplication: 'end',
                borderRadius: 2
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: 'Inter, sans-serif'
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 1
                }
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['white']
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 5,
                right: 2,
                top: 14
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true, // Tampilkan legenda
            position: 'bottom', // Posisi legenda di bawah chart
            labels: {
                colors: '#FFFFFF', // Warna teks legenda putih
                useSeriesColors: false
            }
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            categories: [], // Tambahkan kategori untuk memastikan label sumbu x diformat dengan benar
            title: {
                text: 'Time',
                style: {
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif'
                }
            }
        },
        yaxis: {
            show: true,
            title: {
                text: 'Distance',
                style: {
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif'
                }
            }
        },
        fill: {
            opacity: 1,
            colors: []
        }
    };

    onMount(() => {
        const unsubscribe = strikesresult.subscribe((strikesData) => {
            // Store all data
            allData = strikesData;
            // Update selected data with the latest strikes data
            selectedData = strikesData; // Update with the last 5 strikes
            updateChart(); // Call updateChart to update the chart options
        });

        return () => {
            unsubscribe();
        };
    });

    const filterData = (period) => {
        let filteredData = [];
        const now = new Date();

        switch (period) {
            case 'Yesterday':
                const yesterdayStart = startOfDay(subDays(now, 1));
                const yesterdayEnd = endOfDay(subDays(now, 1));
                filteredData = allData.filter(d => new Date(d.time) >= yesterdayStart && new Date(d.time) <= yesterdayEnd);
                break;
            case 'Today':
                const todayStart = startOfDay(now);
                const todayEnd = endOfDay(now);
                filteredData = allData.filter(d => new Date(d.time) >= todayStart && new Date(d.time) <= todayEnd);
                break;
            case 'Last 7 days':
                const last7Days = subDays(now, 7);
                filteredData = allData.filter(d => new Date(d.time) >= last7Days);
                break;
            case 'Last 30 days':
                const last30Days = subDays(now, 30);
                filteredData = allData.filter(d => new Date(d.time) >= last30Days);
                break;
            case 'Last 90 days':
                const last90Days = subDays(now, 90);
                filteredData = allData.filter(d => new Date(d.time) >= last90Days);
                break;
            default:
                filteredData = allData;
        }

        selectedData = filteredData; // Update with the filtered data
        updateChart(); // Call updateChart to update the chart options
    };
</script>

<Card.Root>
    <Card.Header>
      <Card.Title>Card Title</Card.Title>
      <Card.Description>Card Description</Card.Description>
    </Card.Header>
    <Card.Content>
      <p>Card Content</p>



    <h1 class="flex justify-center uppercase text-sm font-bold px-7 py-2 hover:no-underline">Lightning Graphic</h1>
        <div class="flex justify-between items-center pt-0">
            <div class="relative border-black-500 border-t">
                <Button class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-7 py-2 hover:no-underline">
                    Select Day
                    <ChevronDownOutline class="w-3 m-2 ms-14" />
                </Button>
                <Dropdown class="w-40 absolute top-10 right-10 border-black-200 border-t dark:border-gray-700 justify-between" offset="6">
                    <DropdownItem on:click={() => filterData('Yesterday')} style="background-color: rgba(0, 0, 0, 0); color: white;">Yesterday</DropdownItem>
                    <DropdownItem on:click={() => filterData('Today')} style="background-color: rgba(0, 0, 0, 0); color: white;">Today</DropdownItem>
                    <DropdownItem on:click={() => filterData('Last 7 days')} style="background-color: rgba(0, 0, 0, 0); color: white;">Last 7 days</DropdownItem>
                    <DropdownItem on:click={() => filterData('Last 30 days')} style="background-color: rgba(0, 0, 0, 0); color: white;">Last 30 days</DropdownItem>
                    <DropdownItem on:click={() => filterData('Last 90 days')} style="background-color: rgba(0, 0, 0, 0); color: white;">Last 90 days</DropdownItem>
                </Dropdown>
            </div>
            <a href="/data-table" class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-7 py-2 hover:underline">
                Lightning Report
                <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5" />
            </a>
        </div>
    <Chart {options} />

    <div class="flex justify-center mt-4">
        <div class="flex items-center mr-4">
            <div class="w-4 h-4 bg-blue-500 mr-2"></div>
            <span class="">Intensity ≤ 5</span>
        </div>
        <div class="flex items-center mr-4">
            <div class="w-4 h-4 bg-orange-500 mr-2"></div>
            <span class="">5 &lt; Intensity ≤ 10</span>
        </div>
        <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 mr-2"></div>
            <span class="">Intensity &gt; 10</span>
        </div>
    </div>


</Card.Content>

</Card.Root>