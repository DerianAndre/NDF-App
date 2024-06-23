"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Using epsilon to avoid floating point errors
const round = (value: number, decimals: number) =>
  Number(Math.round(Number(`${value}e${decimals}`)) + "e-" + decimals);

export default function Home() {
  const [fps, setFps] = useState<number>(25);
  const [currentISO, setCurrentISO] = useState<number>(100);
  const [desiredISO, setDesiredISO] = useState<number>(100);
  const [currentApperture, setCurrentApperture] = useState<number>(1.7);
  const [desiredApperture, setDesiredApperture] = useState<number>(1.7);
  const [currentEV, setCurrentEV] = useState<number>(0);
  const [desiredEV, setDesiredEV] = useState<number>(0);
  const [currentShutterSpeed, setCurrentShutterSpeed] = useState<number>(0.001);
  const [currentShutterSpeedInput, setCurrentShutterSpeedInput] =
    useState<string>("1/100");
  const [stops, setStops] = useState<number>(1);
  const [filter, setFilter] = useState<number>(0);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  const handleSwitch = (value: boolean) => {
    setIsAdvancedMode(value);
  };

  const calculate = () => {
    const currentN = Math.pow(currentApperture, 2);
    const caclcCurrentEV = round(
      Math.log2(currentN / currentShutterSpeed) - Math.log2(currentISO),
      2
    );

    const desiredShutterSpeed = 1 / (2 * fps);
    const desiredN = isAdvancedMode ? Math.pow(desiredApperture, 2) : currentN;
    const calcDesiredISO = isAdvancedMode ? desiredISO : currentISO;
    const calcDesiredEV = round(
      Math.log2(desiredN / desiredShutterSpeed) - Math.log2(calcDesiredISO),
      2
    );
    const stops = round(caclcCurrentEV - calcDesiredEV, 0);
    const filter = round(Math.pow(2, stops), 0);

    // console.log({ caclcCurrentEV, calcDesiredEV, filter, stops });

    setCurrentEV(caclcCurrentEV);
    setDesiredEV(calcDesiredEV);
    setStops(stops);
    setFilter(filter);
  };

  const setShutterSpeedValue = (value: string) => {
    setCurrentShutterSpeedInput(value);
    const [numerator, denominator] = value.split("/");

    if (!numerator || !denominator)
      return setCurrentShutterSpeed(Number(value));

    if (!denominator) return setCurrentShutterSpeed(Number(value));

    setCurrentShutterSpeed(Number(numerator) / Number(denominator));
  };

  const shutterSpeedRecomendation = `1/${fps * 2}`;

  useEffect(() => {
    setShutterSpeedValue(currentShutterSpeedInput);
  }, [currentShutterSpeedInput]);

  useEffect(() => {
    calculate();
  }, [
    currentApperture,
    currentISO,
    currentShutterSpeed,
    desiredApperture,
    desiredISO,
    fps,
    isAdvancedMode,
  ]);

  return (
    <div className="md:container max-w-[800px] m-2 md:mx-auto md:m-20">
      <Card>
        <CardHeader className="flex-col md:flex-row justify-between gap-5 p-3 pt-6 pb-0 md:p-6 md:pb-0">
          <div>
            <CardTitle className="mb-2">ND Filter Calculator</CardTitle>
            <CardDescription>
              Calculate the ND filter you need for your camera settings,
              remember this is just a recommendation. In practice you may need
              to adjust the settings depending on the lighting conditions and
              the effect you want to achieve.
            </CardDescription>
          </div>
          <div className="flex min-w-[115px] text-sm font-bold items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={handleSwitch}
            />
            <Label>{isAdvancedMode ? "Advanced" : "Simple"}</Label>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <hr className="mb-3 -mx-3 md:mb-6 md:-mx-6" />
          <h2 className="text-lg font-bold mb-2">Current Settings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-start gap-2">
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">ISO</Label>
              <Input
                id="current-iso"
                type="number"
                placeholder="ISO"
                value={currentISO || undefined}
                onChange={(e) => setCurrentISO(Number(e.target.value))}
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">Apperture</Label>
              <Input
                id="current-apperture"
                type="number"
                placeholder="1.7"
                value={currentApperture || undefined}
                onChange={(e) => setCurrentApperture(Number(e.target.value))}
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">
                Shutter Speed
              </Label>
              <Input
                id="current-shutter-speed"
                type="text"
                placeholder="1/50"
                value={currentShutterSpeedInput}
                onChange={(e) => setShutterSpeedValue(e.target.value)}
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">FPS</Label>
              <Input
                id="fps"
                type="number"
                placeholder="FPS"
                value={fps || undefined}
                onChange={(e) => setFps(Number(e.target.value))}
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">EV</Label>
              <Input
                id="current-ev"
                type="number"
                placeholder="EV"
                value={currentEV}
                disabled
              />
            </div>
          </div>
          <hr className="my-3 -mx-3 md:my-6 md:-mx-6" />
          <h2 className="text-lg font-bold mb-2">Desired Settings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-start gap-2">
            {isAdvancedMode && (
              <>
                <div className="grid items-center gap-1.5">
                  <Label className="font-bold text-sm opacity-75">ISO</Label>
                  <Input
                    id="desired-iso"
                    type="number"
                    placeholder="ISO"
                    value={desiredISO || undefined}
                    onChange={(e) => setDesiredISO(Number(e.target.value))}
                  />
                </div>
                <div className="grid items-center gap-1.5">
                  <Label className="font-bold text-sm opacity-75">
                    Apperture
                  </Label>
                  <Input
                    id="desired-apperture"
                    type="number"
                    placeholder="1.8"
                    value={desiredApperture || undefined}
                    onChange={(e) =>
                      setDesiredApperture(Number(e.target.value))
                    }
                  />
                </div>
              </>
            )}
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">
                Shutter Speed
              </Label>
              <Input
                id="desired-shutter-speed"
                type="text"
                placeholder="1/50"
                value={shutterSpeedRecomendation}
                disabled
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">Stops</Label>
              <Input
                id="stops"
                type="number"
                placeholder="Stops"
                value={stops}
                disabled
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label className="font-bold text-sm opacity-75">EV</Label>
              <Input
                id="desired-ev"
                type="number"
                placeholder="EV Desired"
                value={desiredEV}
                disabled
              />
            </div>
          </div>

          {filter > 0 && (
            <>
              <hr className="my-3 -mx-3 md:my-6 md:-mx-6" />
              <div className="flex-col flex items-center justify-center gap-3">
                <h3 className="text-xs font-bold uppercase">Recommendation</h3>
                <Badge variant="secondary" className="py-2 px-7 text-2xl">
                  Filter ND {filter}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="mt-2 text-center">
        <small className="opacity-45">
          Created with ❤️ by{" "}
          <a
            className="underline"
            target="_blank"
            href="https://derianandre.com"
          >
            Derian André
          </a>
        </small>
      </div>
    </div>
  );
}
