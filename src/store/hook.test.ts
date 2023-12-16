import { useWorkingDirFiles } from "./hooks"

describe("useWorkingDirFiles", () => {
  it("should return the working dir files", () => {
    expect(useWorkingDirFiles()).toEqual([])
  })

})
