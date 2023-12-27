import { fetchUsername } from "@lib/actions";

export default async function AuthStatus() {
  const sessionUserName = await fetchUsername();
  return (
    <div className="absolute top-5 w-full flex justify-center items-center">
      {sessionUserName && (
        <p className="text-stone-200 text-sm">
          Signed in as {sessionUserName}
        </p>
      )}
    </div>
  );
}
