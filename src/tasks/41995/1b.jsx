import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Dummy data for initial polls
const initialPolls = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  question: `Poll Question ${i + 1}`,
  options: [
    { id: 1, text: "Option 1", votes: 0 },
    { id: 2, text: "Option 2", votes: 0 },
    { id: 3, text: "Option 3", votes: 0 },
    { id: 4, text: "Option 4", votes: 0 },
  ],
}));

export default function App() {
  const [polls, setPolls] = useState(initialPolls);
  const [activeTab, setActiveTab] = useState("voting");
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", "", "", ""],
  });

  const handleVote = (pollId, optionId) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((option) =>
                option.id === optionId
                  ? { ...option, votes: option.votes + 1 }
                  : option
              ),
            }
          : poll
      )
    );
    setSelectedPoll(null);
  };

  const handleCreatePoll = () => {
    const newPollId = polls.length + 1;
    const createdPoll = {
      id: newPollId,
      question: newPoll.question,
      options: newPoll.options
        .filter((option) => option.trim() !== "")
        .map((option, index) => ({
          id: index + 1,
          text: option,
          votes: 0,
        })),
    };
    setPolls((prevPolls) => [...prevPolls, createdPoll]);
    setNewPoll({ question: "", options: ["", "", "", ""] });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Voting App</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="create">Create Poll</TabsTrigger>
        </TabsList>
        <TabsContent value="voting">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {polls.map((poll) => (
              <Card key={poll.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{poll.question}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Vote</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{poll.question}</DialogTitle>
                      </DialogHeader>
                      <RadioGroup
                        onValueChange={(value) =>
                          handleVote(poll.id, parseInt(value))
                        }
                      >
                        {poll.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                            <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="results">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {polls.map((poll) => (
              <Card key={poll.id}>
                <CardHeader>
                  <CardTitle>{poll.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  {poll.options.map((option) => (
                    <div key={option.id} className="mb-2">
                      <div className="flex justify-between">
                        <span>{option.text}</span>
                        <span>{option.votes} votes</span>
                      </div>
                      <div className="bg-gray-200 h-2 rounded-full mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (option.votes /
                                poll.options.reduce(
                                  (sum, opt) => sum + opt.votes,
                                  0
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={newPoll.question}
                    onChange={(e) =>
                      setNewPoll({ ...newPoll, question: e.target.value })
                    }
                    placeholder="Enter your question"
                  />
                </div>
                {newPoll.options.map((option, index) => (
                  <div key={index}>
                    <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                    <Input
                      id={`option-${index}`}
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...newPoll.options];
                        updatedOptions[index] = e.target.value;
                        setNewPoll({ ...newPoll, options: updatedOptions });
                      }}
                      placeholder={`Enter option ${index + 1}`}
                    />
                  </div>
                ))}
                <Button onClick={handleCreatePoll}>Create Poll</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}