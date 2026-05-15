import type { User } from "@/db/schemas/users.schema";

export type BuyerOnboardingData = Partial<{
  firstName: string;
  lastName: string;
  bio: string;
  country: string;
  birthday: string;
  interests: string[];
  avatarUrl: string;
  avatarPublicId: string;
}>;

export type BuyerProfileViewData = Omit<User, "onboardingData"> & {
  onboardingData: BuyerOnboardingData;
};
