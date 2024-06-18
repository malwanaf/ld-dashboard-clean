<script lang="ts">
    import { Chart} from 'flowbite-svelte';
    import { ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    import { strikesresult } from '$lib/stores/strikes.ts';
    import { format, subDays, startOfDay, endOfDay } from 'date-fns';
    import * as Card from "$lib/components/ui/card";
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { setMode, mode } from 'mode-watcher';

    

    let selectedData = [];
    let allData = [];

    const updateChart = () => {
    // Define the interval for the time points you want to display
    let timeLabelInterval = 5;
    if(position=="1"){
        timeLabelInterval = 5;
    }else if (position=="2"){
        timeLabelInterval = 50;
    }else if (position=="3"){
        timeLabelInterval = 10;
    }else if (position=="4"){
        timeLabelInterval = 20;
    }else if (position=="5"){
        timeLabelInterval = 30;
    }

    // Format and filter the time points
    const categories = selectedData.map((d, i) => {
        
        let formattedTime = format(new Date(d.time), 'dd/MM');
        if(position=="1"){
        formattedTime = format(new Date(d.time), 'HH:mm:ss');
        }else if (position=="2"){
            formattedTime = format(new Date(d.time), 'dd/MM');;
        }else if (position=="3"){
            formattedTime = format(new Date(d.time), 'dd/MM');;
        }else if (position=="4"){
            formattedTime = format(new Date(d.time), 'dd/MM');;
        }else if (position=="5"){
            formattedTime = format(new Date(d.time), 'dd/MM');;
        }


        // Only include every nth time point
        return i % timeLabelInterval === 0 ? formattedTime : '';
    });

    // Map the data with the required format
    const data = selectedData.map(d => ({
        x: format(new Date(d.time), 'dd/MM/yyyy HH:mm:ss'),
        y: d.distance,
        fillColor: d.intensity <= 5 ? 'green' : (d.intensity > 5 && d.intensity <= 10 ? 'orange' : 'red')
    }));

    // Update the chart options
    options.xaxis.categories = categories;
    options.series[0].data = data.map(d => d.y);
    options.colors = data.map(d => d.fillColor);
};




   
const optionsDark = {
    series: [
        {
            name: 'Distance',
            data: []
            
        }
    ],
    colors: [],
    chart: {
        type: 'bar',
        height: '240px',
        toolbar: {
            show: true
        },
        background: 'rgba(0, 0, 0, 0)', // Latar belakang hitam dengan opacity 50%
        foreColor: '#FFFFFF', // Warna teks putih
        border: {
            borderColor: '#FFFFFF', // Warna border putih
            borderWidth: 1 // Lebar border
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
        style: {}
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
            rotate: 0, // Keep labels horizontal
            style: {
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
                fontWeight: 600,
                fontFamily: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            }
        }
    },
    yaxis: {
        show: true,
        title: {
            text: 'Distance',
            style: {
                color: '#FFFFFF',
                fontWeight: 600,
                fontFamily: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            }
        }
    },
    fill: {
        opacity: 1,
        colors: []
    }
};

const optionsLight = {
    series: [
        {
            name: 'Distance',
            data: []
        }
    ],
    colors: [],
    chart: {
        type: 'bar',
        height: '240px',
        toolbar: {
            show: true
        },
        background: 'rgba(255, 0, 0, 0)', // Latar belakang hitam dengan opacity 50%
        foreColor: '#FFFFFF', // Warna teks putih
        border: {
            borderColor: '#FFFFFF', // Warna border putih
            borderWidth: 1 // Lebar border
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
        style: {}
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
            rotate: 0, // Keep labels horizontal
            style: {
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
                fontWeight: 600,
                fontFamily: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            }
        }
    },
    yaxis: {
        show: true,
        title: {
            text: 'Distance',
            style: {
                color: '#FFFFFF',
                fontWeight: 600,
                fontFamily: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            }
        }
    },
    fill: {
        opacity: 1,
        colors: []
    }
};


    import {Badge} from '$lib/components/ui/badge'
    let options;
    if ($mode === 'light') {
			options = optionsLight;
		} else {
			options = optionsDark;
		}

    onMount(() => {
        const unsubscribe = strikesresult.subscribe((strikesData) => {
            // Store all data
            allData = strikesData;
            // Update selected data with the latest strikes data
            selectedData = strikesData; 
            filterData('Last 7 days');// Update with the last 5 strikes
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
            case 'All Time':                
                filteredData = allData
                break;
            default:
                filteredData = allData;
        }

        selectedData = filteredData; // Update with the filtered data
        updateChart(); // Call updateChart to update the chart options
    };

    let position = "3";

    
</script>

<Card.Root class="border-none bg-black/10">
    <!-- <Card.Header>
      <Card.Title>Card Title</Card.Title>
      <Card.Description>Card Description</Card.Description>
    </Card.Header> -->
    <Card.Content class="mt-2  bg-transparent">
      



    <!-- <h1 class="flex justify-center uppercase text-sm font-bold px-7 py-2 hover:no-underline text-white">Lightning Graphic</h1> -->
        <div class="flex justify-between items-center pt-2">


            <div class="relative">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild let:builder>
                      <Button variant="outline" builders={[builder]}>{position === "1" ? 'Today' : position === "2" ? 'Yesterday' : position === "3" ? 'Last 7 days' : position === "4" ? 'Last 30 days' : 'Select Time Range'}

                        <ChevronDownOutline class="w-3 m-2 ms-14" />
                      </Button>

                      
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-56">
                      <!-- <DropdownMenu.Label>Time Range</DropdownMenu.Label> -->
                      <DropdownMenu.Separator />
                      <DropdownMenu.RadioGroup bind:value={position}>
                        <DropdownMenu.RadioItem value="1" on:click={() => filterData('Today')}>Today</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem value="2" on:click={() => filterData('Yesterday')}>Yesterday</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem value="3" on:click={() => filterData('Last 7 days')}>Last 7 Days</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem value="4" on:click={() => filterData('Last 30 days')} >Last 30 Days</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem value="5" on:click={() => filterData('All Time')} >All Time</DropdownMenu.RadioItem>
                      </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
               
            </div>
           
        </div>
    <Chart {options} class="dark:text-black text-black " />

   


</Card.Content>

</Card.Root>