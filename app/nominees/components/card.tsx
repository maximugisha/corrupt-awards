"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Nominee } from "@/types/interfaces";
import { NomineeRatings } from "./ratings";
import { NomineeComments } from "./comments";

interface NomineeCardProps {
  nominee: Nominee;
}

export function NomineeCard({ nominee }: NomineeCardProps) {
  return (
    <Card className="p-6 relative">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <Image
            src={nominee.image ? nominee.image : "/npp.png"}
            alt={nominee.name}
            width={96}
            height={96}
          />
        </Avatar>
        <h2 className="text-xl text-cyan-700 font-semibold mb-2">
          <Link href={`/nominees/${nominee.id}`} className="hover:underline">
            {nominee.name}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">
          {nominee.position.name} at {nominee.institution.name}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-black mb-2">Recent Ratings</h3>
          <NomineeRatings ratings={nominee.rating} />
        </div>

        <NomineeComments nomineeId={nominee.id} />
      </div>

      <Link
        href={`/nominees/${nominee.id}/rate`}
        className="absolute top-4 right-4 bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-cyan-800 transition"
      >
        Rate
      </Link>
    </Card>
  );
}