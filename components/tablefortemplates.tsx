import { Card, Metric, Text, Flex, Callout, Color, Grid, Button } from "@tremor/react";
import { allTemplatesWithUserId } from "@lib/actions";
import { TemplatesWithAuthor } from "@lib/types";
import Link from "next/link";

export default async function TableTemplates() {
  const templates : TemplatesWithAuthor[] = await allTemplatesWithUserId()
  return (
      <>
        <Grid numItemsSm={2} numItemsLg={3} className="gap-8">
          {templates.map((item) => (
          <Card key={item.title}>
            <Text>{item.createdAt.toString()}</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-3 truncate">
              <Metric>{item.title}</Metric>
            </Flex>
            <Callout
              className="mt-6"
              title={`${item.title}`}
              >
              {item.content}
            </Callout>
            <div>
            <Link href={`/addreport/${item.id}`}>
                  <Button size="xl" variant="secondary" color="gray">
                    Use this Template
                  </Button>
            </Link>
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}