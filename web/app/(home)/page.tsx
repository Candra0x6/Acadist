'use client';
import { Button } from '@/components/ui/button';
import desi from '@/public/assets/images/desi.png';
import Image from 'next/image';
import arrowIcon from '@/public/assets/icon/arrow.svg';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaCheck, FaChevronRight } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_LIST = [
  {
    question: 'What is this app?',
    answer:
      'This app is a research paper writing tool that helps you write research papers quickly and easily.',
  },
  {
    question: 'How much does it cost?',
    answer: 'This app is free to use.',
  },
  {
    question: 'How do I get started?',
    answer:
      'To get started, simply sign up for an account and start writing your research papers.',
  },
  {
    question: 'How do I get help?',
    answer: 'If you need help, you can contact our support team at',
  },
];

export default function Home() {
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [selectedFAQIndex, setSelectedFAQIndex] = useState(0);
  const previews = [
    {
      id: 1,
      title: 'AI Assistens',
      video: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    },
    {
      id: 2,
      title: 'Auto Summarize',
      video: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    },
    {
      id: 3,
      title: 'Math Paper',
      video: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    },
    {
      id: 4,
      title: 'Many More',
      video: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    },
  ];

  const handlePreviewClick = (index: number) => {
    setSelectedPreviewIndex(index);
  };
  const handleFAQClick = (index: number) => {
    setSelectedFAQIndex(index);
  };
  return (
    <main className="space-y-60 max-w-8xl mx-auto">
      <section className="min-h-screen flex flex-col items-center ">
        <div className="py-20 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold leading-snug">
              Accelerate your searchy nknmokknk
              <br /> process in a weeks{', '}
              <span className="before:block before:absolute before:-inset-1 before:skew-y-1 before:bg-card relative inline-block">
                <span className="relative text-foreground">
                  not in mountsss.
                </span>
              </span>
            </h1>
            <p className="text-xl mt-4 text-muted-foreground">
              Turn your research ideas into papers quickly with tools that{' '}
              <br />
              simplify the process
            </p>
          </div>
          <Button className="mt-8 px-7 py-6 border-2 bg-primary hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-primary/80 dark:focus:ring-primary shadow-lg shadow-primary/50 dark:shadow-lg dark:shadow-primary/80 font-medium rounded-lg text-sm  text-center me-2 mb-2 ">
            Lets Wrig <span className="text-white/80">- for free</span>
          </Button>
        </div>
        <div className="bg-[#E9E4DA] w-full rounded-[50px]">
          <Image
            src={desi}
            alt="Desi"
            width={1000}
            height={1000}
            className="w-full h-[1200px] object-cover p-5 rounded-[50px]"
          />
        </div>
      </section>
      <section className="">
        <div className="flex flex-col gap-y-3 items-center text-center mb-20">
          <h1 className="text-primary text-xl">SIMPLE WORKS</h1>
          <h1 className="font-bold text-5xl">Streamline Your Research</h1>
          <p className="text-muted-foreground text-xl">
            Quickly create well-organized papers with ease.
          </p>
        </div>

        <div className="flex h-full gap-5">
          <div className="w-full h-[300px] flex flex-col bg-card rounded-xl p-10 gap-y-2">
            <h1 className="text-8xl mb-5">✍️</h1>
            <h2 className="text-foreground text-2xl font-semibold">
              Write your Idea with Easly{' '}
            </h2>
            <p className="text-md text-muted-foreground">Math Paper</p>
          </div>
          <div className="my-auto flex items-center">
            <Image
              src={arrowIcon}
              alt="Arrow Icon"
              className="w-[300px] rotate-12"
            />
          </div>
          <div className="w-full h-[300px] flex flex-col bg-card rounded-xl p-10 gap-y-2">
            <h1 className="text-8xl mb-5">✍️</h1>
            <h2 className="text-foreground text-2xl font-semibold">
              Write your Idea with Easly{' '}
            </h2>
            <p className="text-md text-muted-foreground">Math Paper</p>
          </div>
          <div className="my-auto flex items-center">
            <Image
              src={arrowIcon}
              alt="Arrow Icon"
              className="w-[300px] rotate-12"
            />
          </div>
          <div className="w-full h-[300px] flex flex-col bg-card rounded-xl p-10 gap-y-2">
            <h1 className="text-8xl mb-5">✍️</h1>
            <h2 className="text-foreground text-2xl font-semibold">
              Write your Idea with Easly{' '}
            </h2>
            <p className="text-md text-muted-foreground">Math Paper</p>
          </div>
        </div>
      </section>
      <section className="">
        <div className="flex flex-col gap-y-3 items-center text-center mb-20">
          <h1 className="text-primary text-xl">DEMO WORKS</h1>
          <h1 className="font-bold text-5xl">Simple use for beginner</h1>
          <p className="text-muted-foreground text-xl">
            Quickly create well-organized research papers with ease.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-20">
          {previews.map((item, i) => (
            <div
              key={i}
              onClick={() => handlePreviewClick(i)}
              className={`w-full flex flex-col cursor-pointer mb-10 ${
                selectedPreviewIndex == i ? 'bg-card' : ''
              } rounded-xl p-2 gap-y-2 text-center`}
            >
              <h1 className="font-bold">{item.title}</h1>
            </div>
          ))}
        </div>
        {previews[selectedPreviewIndex] && (
          <div className="bg-[#E9E4DA] w-full rounded-[50px]">
            <Image
              src={desi}
              alt="Desi"
              width={1000}
              height={1000}
              className="w-full h-[900px] object-cover p-5 rounded-[50px]"
            />
          </div>
        )}
      </section>
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-y-3 items-center text-center mb-20">
          <h1 className="text-primary text-xl">PRICING TAILORD</h1>
          <h1 className="font-bold text-5xl">Low Price High Value</h1>
          <p className="text-muted-foreground text-xl">
            Quickly easy payment method with secure. <br />
            No hidden fee, no extra charge.
          </p>
        </div>
        <div className="flex justify-center items-center gap-10">
          <Card className="border-0 rounded-[50px] p-2 flex flex-col w-[320px] h-[480px]">
            <CardHeader>
              <span className="text-muted-foreground">Free</span>
              <CardTitle className="text-7xl">
                $0
                <span className="text-muted-foreground text-lg font-normal">
                  /mount
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="flex flex-col gap-3">
                <div className="text-muted-foreground flex items-center">
                  <FaCheck />
                  <span className="ms-2">AI Assistens</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <div className="relative">
            <div className="absolute -right-28 -top-10">
              <h1>Save 40% 😲</h1>
              <Image
                src={arrowIcon}
                alt="Arrow Icon"
                className="w-[50px] rotate-180 "
              />
            </div>
            <Card className="border-0 rounded-[50px] p-2 flex flex-col w-[400px] h-[550px] shadow-2xl shadow-black/30">
              <CardHeader>
                <span className="text-muted-foreground">Free</span>
                <CardTitle className="text-7xl">
                  $0
                  <span className="text-muted-foreground text-lg font-normal">
                    /mount
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="flex flex-col gap-3">
                  <div className="text-muted-foreground flex items-center">
                    <FaCheck />
                    <span className="ms-2">AI Assistens</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="">
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          </div>
          <Card className="border-0 rounded-[50px] p-2 flex flex-col w-[320px] h-[480px]">
            <CardHeader>
              <span className="text-muted-foreground">Free</span>
              <CardTitle className="text-7xl">
                $0
                <span className="text-muted-foreground text-lg font-normal">
                  /mount
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="flex flex-col gap-3">
                <div className="text-muted-foreground flex items-center">
                  <FaCheck />
                  <span className="ms-2">AI Assistens</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      <section className="flex flex-col max-w-6xl mx-auto items-center pb-20 ">
        <div className="flex flex-col gap-y-3 items-center text-center mb-20">
          <h1 className="text-primary text-xl">PRICING TAILORD</h1>
          <h1 className="font-bold text-5xl">Low Price High Value</h1>
          <p className="text-muted-foreground text-xl">
            Quickly easy payment method with secure. <br />
            No hidden fee, no extra charge.
          </p>
        </div>
        <div className="flex flex-col gap-y-3 w-full">
          {FAQ_LIST.map((item, i) => (
            <Accordion
              key={i}
              type="single"
              className="bg-card rounded-xl"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-5 text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="p-5 text-lg">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            // <Card
            //   key={i}
            //   className="w-full border-0 rounded-3xl justify-center flex flex-col p-0 cursor-pointer"
            //   onClick={() => handleFAQClick(i)}
            // >
            //   <CardHeader className="flex w-full justify-between items-center space-y-0">
            //     <CardTitle className="text-xl font-normal">
            //       {item.question}
            //     </CardTitle>
            //     <FaChevronRight className="text-xl" />
            //   </CardHeader>
            //   <CardContent
            //     className={`transition-all duration-500 ease-in-out ${
            //       selectedFAQIndex == i ? "h-auto" : "h-0 unvisible"
            //     }`}
            //   >
            //     <CardDescription>
            //       {selectedFAQIndex == i && item.answer}
            //     </CardDescription>
            //   </CardContent>
            // </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
